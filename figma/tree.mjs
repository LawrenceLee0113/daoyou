// 用法：node figma/tree.mjs "<frame 名稱>" [深度]
// 把快照印成精簡的圖層樹（位置、尺寸、字型、顏色、文字、有沒有原型互動），切版時看結構用，不用讀整份 JSON。
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const hex = (c) => '#' + [c.r, c.g, c.b].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('') + (c.a < 1 ? `/${c.a}` : '');
const paint = (p) => (p ?? []).filter((f) => f.visible !== false).map((f) => (f.type === 'SOLID' ? hex(f.color) + (f.opacity < 1 ? `@${f.opacity}` : '') : f.type)).join(',');

function walk(n, d, max) {
	if (d > max) return;
	const b = n.box ? `${n.box.x},${n.box.y} ${n.box.w}x${n.box.h}` : '';
	const s = n.style ? ` font=${n.style.fontFamily}/${n.style.fontWeight}/${n.style.fontSize}` : '';
	const extra = [
		n.fills?.length ? 'fill=' + paint(n.fills) : '',
		n.strokes?.length ? `stroke=${paint(n.strokes)}/${n.strokeWeight}` : '',
		n.cornerRadius ? 'r=' + n.cornerRadius : '',
		n.effects?.length ? 'fx=' + n.effects.map((e) => `${e.type}(${e.offset?.x ?? ''},${e.offset?.y ?? ''},${e.radius},${e.color ? hex(e.color) : ''})`).join(';') : '',
		n.opacity < 1 ? 'op=' + n.opacity : '',
		n.interactions?.length ? 'INTERACT' : '',
	].filter(Boolean).join(' ');
	console.log(`${'  '.repeat(d)}${n.type} "${n.name}" ${b}${s} ${extra}${n.characters ? ` «${n.characters.replace(/\s*\n\s*/g, '⏎')}»` : ''}`);
	const kids = n.children ?? [];
	if (kids.length > 4 && kids.every((c) => c.type === 'VECTOR')) return console.log(`${'  '.repeat(d + 1)}…${kids.length} 個 vector`);
	kids.forEach((c) => walk(c, d + 1, max));
}

const [name, depth = 99] = process.argv.slice(2);
walk(JSON.parse(readFileSync(join(import.meta.dirname, 'snapshots', `${name}.json`), 'utf8')), 0, +depth);
