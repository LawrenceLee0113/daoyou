// 用法：node figma/snapshot.mjs <channel ID>
// 直接連 Talk to Figma 的 WebSocket relay（不經過 MCP，資料不用經過 Claude），
// 把目前 page 上每個頂層 frame 存成 figma/snapshots/<frame 名稱>.json，之後用 git status / git diff 看哪些 frame 改了。
// - 去掉 node id、座標改成相對於 frame 左上角，避免「複製檔案」「在畫布上搬動 frame」被誤判成修改。
// - 外掛不回傳圖片內容跟 Auto Layout，所以另外記錄 frame 截圖的 sha256（render），畫面有任何變化都會反映出來。
// - 截圖 <名稱>.png 跟快照一起進 git，舊版用 git show HEAD:figma/snapshots/<名稱>.png 取回。
import { writeFileSync, mkdirSync, readdirSync, rmSync, readFileSync } from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const round = (n) => Math.round(n * 100) / 100;
// 所有數字取到小數 2 位，消掉 Figma 浮點誤差（5.635654 vs 5.635650）；更細的顏色變化由 render 雜湊兜底
// ponytail: 指向其他節點的 ID（componentId、transitionNodeID、overrides[].id…）複製檔案後全部會變，一律去掉；
// 代價是比不出「原型連結改指到別頁」，實作時用 get_reactions 即時確認
const isIdKey = (k) => k === 'id' || /(Id|ID)s?$/.test(k);
const clean = (v) =>
	typeof v === 'number' ? round(v)
	: Array.isArray(v) ? v.map(clean)
	: v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).filter(([k]) => !isIdKey(k)).map(([k, x]) => [k, clean(x)]))
	: v;

// 對已經正規化過的快照再跑一次結果不變，規則調整後可以直接重整 git 裡的舊快照
export function normalize(node, origin = node.absoluteBoundingBox ?? { x: 0, y: 0 }) {
	// absoluteRenderBounds、localPosition 是畫布上的絕對座標，搬動 frame 就會全變
	const { id, children, absoluteBoundingBox: b, absoluteRenderBounds, localPosition, ...rest } = node;
	const out = clean(rest);
	if (b) out.box = { x: round(b.x - origin.x), y: round(b.y - origin.y), w: round(b.width), h: round(b.height) };
	if (children) out.children = children.map((c) => normalize(c, origin));
	return out;
}

export const fileName = (name) => name.replace(/[\/\\:*?"<>|]/g, '_').trim();

// ponytail: 同名 frame 依圖層順序加「 #2」「 #3」；設計師調整圖層順序時對應會錯開，所以印警告交給人確認
export const dedupe = (names) => names.map((n, i) => {
	const k = names.slice(0, i).filter((m) => m === n).length;
	return k ? `${n} #${k + 1}` : n;
});

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
	const snapDir = join(import.meta.dirname, 'snapshots');
	mkdirSync(snapDir, { recursive: true });

	const figma = await connect(channel);
	const doc = await figma.send('get_document_info');
	const frames = doc.children.filter((n) => SNAPSHOT_TYPES.has(n.type));

	const names = dedupe(frames.map((f) => fileName(f.name)));
	for (const n of names.filter((n) => / #\d+$/.test(n))) console.warn(`⚠ frame 名稱重複，依圖層順序存成「${n}」，請人工確認對應`);

	console.log(`page「${doc.name}」：${frames.length} 個 frame（略過 ${doc.children.length - frames.length} 個散落素材）`);
	for (const [i, f] of frames.entries()) {
		const name = names[i];
		const snap = normalize(await figma.send('get_node_info', { nodeId: f.id }));
		const png = Buffer.from((await figma.send('export_node_as_image', { nodeId: f.id, scale: 1 })).imageData, 'base64');
		snap.render = createHash('sha256').update(png).digest('hex').slice(0, 16);

		writeFileSync(join(snapDir, `${name}.png`), png);
		writeFileSync(join(snapDir, `${name}.json`), JSON.stringify(snap, null, '\t') + '\n');
		console.log(`${f.id}\t${name}`);
	}
	figma.close();

	// 這一版已經不存在的 frame 刪掉快照，git status 會顯示成 D
	for (const file of readdirSync(snapDir)) {
		if (!names.includes(file.replace(/\.(json|png)$/, ''))) rmSync(join(snapDir, file));
	}
}

// node figma/snapshot.mjs --renormalize：正規化規則改了之後，用新規則重整現有快照（不用連 Figma）
function renormalize() {
	const snapDir = join(import.meta.dirname, 'snapshots');
	for (const file of readdirSync(snapDir).filter((f) => f.endsWith('.json'))) {
		const path = join(snapDir, file);
		const { render, ...node } = JSON.parse(readFileSync(path, 'utf8'));
		writeFileSync(path, JSON.stringify({ ...normalize(node), render }, null, '\t') + '\n'); // render 固定放最後，跟 main() 的欄位順序一致
	}
}

// node figma/snapshot.mjs --report：跟最後一次 commit 比，列出每個 frame 是視覺還是非視覺變更、文字與圖層增減
const layers = (n, path = '', out = []) => {
	const p = path ? `${path}/${n.name}` : n.name;
	if (path) out.push(`${p.split('/').slice(1).join('/')} [${n.type}${n.characters ? ` "${n.characters.slice(0, 30)}"` : ''}]`);
	(n.children ?? []).forEach((c) => layers(c, p, out));
	return out;
};
function report() {
	const git = (...args) => execFileSync('git', ['-c', 'core.quotepath=false', ...args], { cwd: import.meta.dirname, encoding: 'utf8' });
	git('add', '-N', 'snapshots');
	const lines = git('diff', '--name-status', 'HEAD', '--', 'snapshots/*.json').trim().split('\n').filter(Boolean);
	if (!lines.length) return console.log('沒有任何變更');
	const groups = { 視覺變更: [], 非視覺變更: [], 新增: [], 刪除: [] };
	for (const line of lines) {
		const [st, file] = line.split('\t');
		const name = file.replace(/^.*snapshots\//, '').replace(/\.json$/, '');
		if (st === 'D') { groups.刪除.push(name); continue; }
		const b = JSON.parse(readFileSync(join(import.meta.dirname, 'snapshots', `${name}.json`), 'utf8'));
		if (st === 'A') { groups.新增.push(`${name}（${layers(b).length} 個圖層）`); continue; }
		const a = JSON.parse(git('show', `HEAD:figma/snapshots/${name}.json`));
		const [la, lb] = [layers(a), layers(b)];
		const del = la.filter((x) => !lb.includes(x)), add = lb.filter((x) => !la.includes(x));
		const detail = [...del.slice(0, 6).map((x) => `    - ${x}`), ...add.slice(0, 6).map((x) => `    + ${x}`)];
		if (del.length > 6 || add.length > 6) detail.push(`    …共 -${del.length} +${add.length} 個圖層`);
		const head = `${name}（圖層 ${la.length}→${lb.length}）`;
		(a.render === b.render ? groups.非視覺變更 : groups.視覺變更).push([head, ...(detail.length ? detail : ['    （圖層沒增減，屬性改變，看 git diff）'])].join('\n'));
	}
	for (const [k, v] of Object.entries(groups)) if (v.length) console.log(`\n## ${k}（${v.length}）\n${v.join('\n')}`);
}

if (import.meta.main ?? process.argv[1] === import.meta.filename) {
	const cmd = { '--renormalize': renormalize, '--report': report }[process.argv[2]];
	(cmd ? Promise.resolve().then(cmd) : main(process.argv[2])).catch((e) => {
		console.error(e.message);
		process.exit(1);
	});
}
