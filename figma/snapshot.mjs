// 用法：node figma/snapshot.mjs <channel ID>
// 直接連 Talk to Figma 的 WebSocket relay（不經過 MCP，資料不用經過 Claude），
// 把目前 page 上每個頂層 frame 存成 figma/snapshots/<frame 名稱>.json，之後用 git status / git diff 看哪些 frame 改了。
// - 去掉 node id、座標改成相對於 frame 左上角，避免「複製檔案」「在畫布上搬動 frame」被誤判成修改。
// - 外掛不回傳圖片內容跟 Auto Layout，所以另外記錄 frame 截圖的 sha256（render），畫面有任何變化都會反映出來。
// - 截圖存在 figma/.cache/（不進 git）；render 有變時，舊截圖改名成 <名稱>.prev.png 方便並排比對。
import { writeFileSync, mkdirSync, readdirSync, rmSync, renameSync, existsSync, readFileSync } from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';

const round = (n) => Math.round(n * 100) / 100;

export function normalize(node, origin = node.absoluteBoundingBox ?? { x: 0, y: 0 }) {
	const { id, children, absoluteBoundingBox: b, ...rest } = node;
	const out = rest;
	if (b) out.box = { x: round(b.x - origin.x), y: round(b.y - origin.y), w: round(b.width), h: round(b.height) };
	if (children) out.children = children.map((c) => normalize(c, origin));
	return out;
}

export const fileName = (name) => name.replace(/[\/\\:*?"<>|]/g, '_').trim();

// 頁面跟元件才拍快照；畫布上散落的 group、圖片、文字是素材，不是頁面
const SNAPSHOT_TYPES = new Set(['FRAME', 'COMPONENT', 'COMPONENT_SET']);

function connect(channel) {
	const ws = new WebSocket('ws://localhost:3055');
	const pending = new Map();
	ws.onmessage = ({ data }) => {
		const msg = JSON.parse(data).message;
		const req = msg?.id && pending.get(msg.id);
		if (!req || !(msg.result || msg.error)) return;
		pending.delete(msg.id);
		clearTimeout(req.timer);
		msg.error ? req.reject(new Error(msg.error)) : req.resolve(msg.result);
	};
	const send = (command, params = {}) =>
		new Promise((resolve, reject) => {
			const id = randomUUID();
			const timer = setTimeout(() => (pending.delete(id), reject(new Error(`${command} 逾時，Figma 外掛還開著嗎？`))), 60_000);
			pending.set(id, { resolve, reject, timer });
			const message = { id, command, params: { ...params, commandId: id } };
			ws.send(JSON.stringify(command === 'join' ? { id, type: 'join', channel, message } : { id, type: 'message', channel, message }));
		});
	return new Promise((resolve, reject) => {
		ws.onerror = () => reject(new Error('連不上 ws://localhost:3055，請先在 talk-to-figma-mcp 執行 bun socket'));
		ws.onopen = () => send('join').then(() => resolve({ send, close: () => ws.close() }), reject);
	});
}

async function main(channel) {
	if (!channel) throw new Error('用法：node figma/snapshot.mjs <channel ID>');
	const snapDir = new URL('./snapshots/', import.meta.url);
	const cacheDir = new URL('./.cache/', import.meta.url);
	mkdirSync(snapDir, { recursive: true });
	mkdirSync(cacheDir, { recursive: true });

	const figma = await connect(channel);
	const doc = await figma.send('get_document_info');
	const frames = doc.children.filter((n) => SNAPSHOT_TYPES.has(n.type));

	const names = frames.map((f) => fileName(f.name));
	const dupes = [...new Set(names.filter((n, i) => names.indexOf(n) !== i))];
	if (dupes.length) throw new Error(`frame 名稱重複，無法對應快照：${dupes.join('、')}`);

	console.log(`page「${doc.name}」：${frames.length} 個 frame（略過 ${doc.children.length - frames.length} 個散落素材）`);
	for (const f of frames) {
		const name = fileName(f.name);
		const snap = normalize(await figma.send('get_node_info', { nodeId: f.id }));
		const png = Buffer.from((await figma.send('export_node_as_image', { nodeId: f.id, scale: 1 })).imageData, 'base64');
		snap.render = createHash('sha256').update(png).digest('hex').slice(0, 16);

		const pngPath = new URL(`${name}.png`, cacheDir);
		const prev = existsSync(pngPath) && createHash('sha256').update(readFileSync(pngPath)).digest('hex').slice(0, 16);
		if (prev && prev !== snap.render) renameSync(pngPath, new URL(`${name}.prev.png`, cacheDir));
		writeFileSync(pngPath, png);
		writeFileSync(new URL(`${name}.json`, snapDir), JSON.stringify(snap, null, '\t') + '\n');
		console.log(`${f.id}\t${name}`);
	}
	figma.close();

	// 這一版已經不存在的 frame 刪掉快照，git status 會顯示成 D
	for (const file of readdirSync(snapDir)) {
		if (!names.includes(file.replace(/\.json$/, ''))) rmSync(new URL(file, snapDir));
	}
}

if (import.meta.main ?? process.argv[1] === import.meta.filename) {
	main(process.argv[2]).catch((e) => {
		console.error(e.message);
		process.exit(1);
	});
}
