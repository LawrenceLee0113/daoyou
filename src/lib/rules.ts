// 遊戲規則：數字都在這裡改。幣跟郵票不另外存，每次從已上傳的照片算出來（照片在、獎勵就在）。

export const MAX_PHOTOS_PER_MAILBOX = 3;
export const COINS_FIRST_PHOTO = 10; // 某個郵筒第一次上傳，另外得到該郵筒的郵票
export const COINS_EXTRA_PHOTO = 5; // 同一郵筒第 2、3 張

// Lv.1 名稱來自設計稿，其他暫定
export const LEVELS = [
	{ stamps: 0, name: 'Lv.1 見習郵差' },
	{ stamps: 3, name: 'Lv.2 正式郵差' },
	{ stamps: 8, name: 'Lv.3 資深郵差' },
	{ stamps: 15, name: 'Lv.4 郵務達人' },
	{ stamps: 22, name: 'Lv.5 島郵大使' },
];

const coinsFor = (photos: number) =>
	photos === 0 ? 0 : COINS_FIRST_PHOTO + (Math.min(photos, MAX_PHOTOS_PER_MAILBOX) - 1) * COINS_EXTRA_PHOTO;

export function summarize(photos: { mailboxId: string }[]) {
	const perMailbox = new Map<string, number>();
	for (const p of photos) perMailbox.set(p.mailboxId, (perMailbox.get(p.mailboxId) ?? 0) + 1);
	const stamps = perMailbox.size;
	const coins = [...perMailbox.values()].reduce((sum, n) => sum + coinsFor(n), 0);
	const level = LEVELS.findLast((l) => stamps >= l.stamps)!.name;
	return { stamps, coins, level };
}
