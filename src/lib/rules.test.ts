// node --test src/lib/rules.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { summarize } from './rules.ts';

const photos = (...ids: string[]) => ids.map((mailboxId) => ({ mailboxId }));

test('沒有照片：Lv.1、0 幣', () => {
	assert.deepEqual(summarize([]), { stamps: 0, coins: 0, level: 'Lv.1 見習郵差', stampIds: [] });
});

test('第一張 10 幣＋郵票，第 2、3 張各 5 幣', () => {
	assert.deepEqual(summarize(photos('a')), { stamps: 1, coins: 10, level: 'Lv.1 見習郵差', stampIds: ['a'] });
	assert.equal(summarize(photos('a', 'a', 'a')).coins, 20);
});

test('3 個郵筒的郵票升到 Lv.2', () => {
	assert.deepEqual(summarize(photos('a', 'b', 'c', 'c')), { stamps: 3, coins: 35, level: 'Lv.2 正式郵差', stampIds: ['a', 'b', 'c'] });
});

test('每張明信片 +10，不限次數', () => {
	assert.equal(summarize(photos('a'), 3).coins, 40);
});
