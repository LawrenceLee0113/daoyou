import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalize, fileName } from './snapshot.mjs';

const frame = (x, y, id) => ({
	id,
	name: '登入',
	type: 'FRAME',
	absoluteBoundingBox: { x, y, width: 390, height: 844 },
	children: [{ id: id + 'a', name: '按鈕', type: 'TEXT', absoluteBoundingBox: { x: x + 16.004, y: y + 700, width: 358, height: 48 } }],
});

test('複製檔案（id 不同）或搬動 frame 不算修改', () => {
	assert.deepEqual(normalize(frame(0, 0, '1:2')), normalize(frame(1200, -300, '9:9')));
});

test('子元素座標相對於 frame', () => {
	assert.deepEqual(normalize(frame(500, 500, '1:2')).children[0].box, { x: 16, y: 700, w: 358, h: 48 });
});

test('檔名去掉不合法字元', () => {
	assert.equal(fileName('首頁 / 登入'), '首頁 _ 登入.json');
});
