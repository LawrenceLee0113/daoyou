// 用法：node figma/export.mjs <channel ID> <frame node id> <輸出資料夾> "<圖層名稱>=<檔名>" ...
// 在 frame 底下依名稱找圖層，匯出成 PNG（scale 2）到輸出資料夾。同名圖層取第一個；名稱可寫成「父層/子層」縮小範圍。
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
		for (const it of n.interactions ?? []) for (const a of (it.actions ?? []).filter(Boolean))
			console.log(`${p}\t${it.trigger?.type}\t${a.navigation ?? a.type}\t${names[a.destinationId] ?? a.destinationId ?? ''}`);
	});
} else {
	mkdirSync(outDir, { recursive: true });
	const nodes = [];
	walk(await figma.send('get_node_info', { nodeId: frameId }), '', (n, p) => nodes.push({ n, p }));
	for (const spec of specs) {
		const [name, file] = spec.split('=');
		const hit = nodes.find(({ n, p }) => n.name === name || p.endsWith(`/${name}`));
		if (!hit) { console.error(`找不到「${name}」`); continue; }
		const { imageData } = await figma.send('export_node_as_image', { nodeId: hit.n.id, scale: 2 });
		writeFileSync(join(outDir, file), Buffer.from(imageData, 'base64'));
		console.log(`${hit.n.id}\t${name} → ${file}`);
	}
}
figma.close();
