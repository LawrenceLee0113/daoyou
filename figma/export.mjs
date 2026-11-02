// 用法：node figma/export.mjs <channel ID> <frame node id> <輸出資料夾> "<圖層名稱>=<檔名>" ...
// 在 frame 底下依名稱找圖層，匯出成 PNG（預設 scale 2，要更大張用 SCALE=4 node figma/export.mjs ...）到輸出資料夾。同名圖層取第一個；名稱可寫成「父層/子層」縮小範圍。
// 也可以 node figma/export.mjs <channel ID> --reactions <frame node id>：列出 frame 裡所有原型互動與目標 frame 名稱。
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { connect } from './snapshot.mjs';

const [channel, frameId, outDir, ...specs] = process.argv.slice(2);
const figma = await connect(channel);
const walk = (n, path, cb) => { const p = path ? `${path}/${n.name}` : n.name; cb(n, p); (n.children ?? []).forEach((c) => walk(c, p, cb)); };

if (frameId === '--reactions') {
	const doc = await figma.send('get_document_info');
	const names = Object.fromEntries(doc.children.map((c) => [c.id, c.name]));
	walk(await figma.send('get_node_info', { nodeId: outDir }), '', (n, p) => {
		if (n.overflowDirection && n.overflowDirection !== 'NONE') console.log(`${p}\t（可捲動：${n.overflowDirection}）`);
		for (const it of n.interactions ?? []) for (const a of (it.actions ?? []).filter(Boolean))
			console.log([p, it.trigger?.type + (it.trigger?.timeout ? `(${it.trigger.timeout}s)` : ''), a.navigation ?? a.type, names[a.destinationId] ?? a.destinationId ?? '',
				a.transition ? `${a.transition.type}${a.transition.direction ? ' ' + a.transition.direction : ''} ${a.transition.duration}s ${a.transition.easing?.type ?? ''}` : ''].join('\t'));
	});
} else {
	mkdirSync(outDir, { recursive: true });
	const nodes = [];
	walk(await figma.send('get_node_info', { nodeId: frameId }), '', (n, p) => nodes.push({ n, p }));
	for (const spec of specs) {
		const [name, file] = spec.split('=');
		const hit = nodes.find(({ n, p }) => n.name === name || p.endsWith(`/${name}`));
		if (!hit) { console.error(`找不到「${name}」`); continue; }
		const { imageData } = await figma.send('export_node_as_image', { nodeId: hit.n.id, scale: Number(process.env.SCALE ?? 2) });
		writeFileSync(join(outDir, file), Buffer.from(imageData, 'base64'));
		console.log(`${hit.n.id}\t${name} → ${file}`);
	}
}
figma.close();
