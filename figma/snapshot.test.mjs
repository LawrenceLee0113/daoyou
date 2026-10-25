import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalize, fileName, assignNames } from './snapshot.mjs';

const frame = (x, y, id, h = 5.635654) => ({
	id,
	name: '登入',
	type: 'FRAME',
	absoluteBoundingBox: { x, y, width: 390, height: 844 },
	absoluteRenderBounds: { x, y, width: 390, height: 844 },
	localPosition: { x, y },
	children: [{ id: id + 'a', name: '按鈕', type: 'INSTANCE', componentId: id + 'c', overrides: [{ id: id + 'o', overriddenFields: ['x'] }], strokeWeight: h, absoluteBoundingBox: { x: x + 16.004, y: y + 700, width: 358, height: 48 } }],
});

test('複製檔案（id 不同）或搬動 frame 不算修改', () => {
	assert.deepEqual(normalize(frame(0, 0, '1:2')), normalize(frame(1200, -300, '9:9', 5.63565)));
});

test('子元素座標相對於 frame', () => {
	assert.deepEqual(normalize(frame(500, 500, '1:2')).children[0].box, { x: 16, y: 700, w: 358, h: 48 });
});

test('檔名去掉不合法字元', () => {
	assert.equal(fileName('首頁 / 登入'), '首頁 _ 登入');
});

const page = (...texts) => ({ name: '台北', type: 'FRAME', children: texts.map((t) => ({ name: t, type: 'TEXT', characters: t })) });
const map = page('地圖', '標題');
const card = page('地圖', '標題', '歪腰郵筒', '看更多');

test('同名 frame：調整圖層順序不影響對應', () => {
	const prev = new Map([['台北', map], ['台北 #2', card]]);
	assert.deepEqual(assignNames('台北', [card, map], prev).map((x) => x.name), ['台北 #2', '台北']);
});

test('同名 frame：新複製出來的拿新編號，最像上一版的沿用舊名', () => {
	const prev = new Map([['台北', card]]);
	assert.deepEqual(assignNames('台北', [map, card], prev).map((x) => x.name), ['台北 #2', '台北']);
});

test('同名 frame：完全不像上一版的不硬配', () => {
	const prev = new Map([['台北', page('完全', '不同')]]);
	assert.deepEqual(assignNames('台北', [map, card], prev).map((x) => x.name), ['台北', '台北 #2']);
});

test('重複正規化結果不變', () => {
	const once = normalize(frame(30, 40, '1:2'));
	assert.deepEqual(normalize(structuredClone(once)), once);
});
