// 用法：node figma/snapshot.mjs <get_node_info 原始 JSON 檔>...
// 把 frame 存成 figma/snapshots/<frame 名稱>.json，之後用 git status / git diff 看哪些 frame 改了。
// 去掉 node id、座標改成相對於 frame 左上角，避免「複製檔案」「在畫布上搬動 frame」被誤判成修改。
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const round = (n) => Math.round(n * 100) / 100;

export function normalize(node, origin = node.absoluteBoundingBox ?? { x: 0, y: 0 }) {
	const { id, children, absoluteBoundingBox: b, ...rest } = node;
	const out = rest;
	if (b) out.box = { x: round(b.x - origin.x), y: round(b.y - origin.y), w: round(b.width), h: round(b.height) };
	if (children) out.children = children.map((c) => normalize(c, origin));
	return out;
}

export const fileName = (name) => name.replace(/[\/\\:*?"<>|]/g, '_').trim() + '.json';

if (import.meta.main ?? process.argv[1] === import.meta.filename) {
	const dir = new URL('./snapshots/', import.meta.url);
	mkdirSync(dir, { recursive: true });
	for (const path of process.argv.slice(2)) {
		const node = JSON.parse(readFileSync(path, 'utf8'));
		writeFileSync(new URL(fileName(node.name), dir), JSON.stringify(normalize(node), null, '\t') + '\n');
		console.log(fileName(node.name));
	}
}
