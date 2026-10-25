// 所有資料讀寫都在這裡（只在瀏覽器執行）。之後接真的後端只需要改這個檔案。
// 換手機、換瀏覽器、清除網站資料後就從頭開始，這是預期中的行為。
import { MAX_PHOTOS_PER_MAILBOX } from './rules';

// 示範用的預設帳號，使用者已確認可以公開。這不是安全機制。
const DEMO_EMAIL = 'repost116.grad@gmail.com';
const DEMO_PASSWORD = 're123456';

// lawrencelee0113.github.io 底下的專案共用同一塊儲存空間，key 一律加 daoyou 前綴
const LOGIN_KEY = 'daoyou:login';
const DB_NAME = 'daoyou';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

// 無痕模式或被封鎖時 localStorage 存取會丟錯，一律當成沒登入
function safe<T>(fn: () => T, fallback: T): T {
	try {
		return fn();
	} catch {
		return fallback;
	}
}

export function login(email: string, password: string) {
	if (email.trim() !== DEMO_EMAIL || password !== DEMO_PASSWORD) return false;
	safe(() => localStorage.setItem(LOGIN_KEY, DEMO_EMAIL), undefined);
	return true;
}

export const isLoggedIn = () => safe(() => localStorage.getItem(LOGIN_KEY) === DEMO_EMAIL, false);

// 沒登入就導到登入頁，登入後回到原本的頁面
export function requireLogin() {
	if (isLoggedIn()) return true;
	location.href = `${base}/login/?next=${encodeURIComponent(location.pathname + location.search)}`;
	return false;
}

export interface Photo {
	id: number;
	mailboxId: string;
	blob: Blob;
	createdAt: number;
}

function openDb() {
	return new Promise<IDBDatabase>((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, 1);
		req.onupgradeneeded = () => req.result.createObjectStore('photos', { keyPath: 'id', autoIncrement: true });
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}

function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>) {
	return openDb().then(
		(db) =>
			new Promise<T>((resolve, reject) => {
				const req = fn(db.transaction('photos', mode).objectStore('photos'));
				req.onsuccess = () => resolve(req.result);
				req.onerror = () => reject(req.error);
			}),
	);
}

// 讀不到（無痕、被清除、不支援）就當成沒有照片
export async function getPhotos(mailboxId?: string): Promise<Photo[]> {
	const all = await tx<Photo[]>('readonly', (s) => s.getAll()).catch(() => []);
	return all.filter((p) => !mailboxId || p.mailboxId === mailboxId).sort((a, b) => b.createdAt - a.createdAt);
}

// 最長邊縮到 1600px、轉成 JPEG 0.8 再存，避免一張手機照片就好幾 MB
async function shrink(file: Blob) {
	const img = await createImageBitmap(file);
	const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
	const canvas = document.createElement('canvas');
	canvas.width = Math.round(img.width * scale);
	canvas.height = Math.round(img.height * scale);
	canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
	img.close();
	return new Promise<Blob>((resolve, reject) =>
		canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('照片轉檔失敗'))), 'image/jpeg', 0.8),
	);
}

export async function addPhoto(mailboxId: string, file: Blob) {
	if ((await getPhotos(mailboxId)).length >= MAX_PHOTOS_PER_MAILBOX) throw new Error(`每個郵筒最多 ${MAX_PHOTOS_PER_MAILBOX} 張`);
	navigator.storage?.persist?.(); // 降低 iOS Safari 清除資料的機率
	const blob = await shrink(file);
	await tx('readwrite', (s) => s.add({ mailboxId, blob, createdAt: Date.now() }));
}
