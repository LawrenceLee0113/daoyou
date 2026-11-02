// 所有資料讀寫都在這裡（只在瀏覽器執行）。之後接真的後端只需要改這個檔案。
// 換手機、換瀏覽器、清除網站資料後就從頭開始，這是預期中的行為。
import { MAX_PHOTOS_PER_MAILBOX } from './rules';

// 示範用的預設帳號，使用者已確認可以公開。這不是安全機制。
export const DEMO_EMAIL = 'repost116.grad@gmail.com';
const DEMO_PASSWORD = 're123456';

// lawrencelee0113.github.io 底下的專案共用同一塊儲存空間，key 一律加 daoyou 前綴
export const LOGIN_KEY = 'daoyou:login';
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

// 登出只清登入狀態，照片、明信片留在這支手機上，再登入就回來
export const logout = () => safe(() => localStorage.removeItem(LOGIN_KEY), undefined);

// 重置資料：這支手機上島郵的資料（個人檔案、照片、明信片、頭像）全部刪掉，像剛登入的新帳號。
// 登入狀態保留（使用者要求重置不登出）；只清 daoyou 開頭的 key，同網域其他專案的資料不動
export function resetAll() {
	safe(() => Object.keys(localStorage).filter((k) => k.startsWith('daoyou') && k !== LOGIN_KEY).forEach((k) => localStorage.removeItem(k)), undefined);
	return new Promise<void>((resolve) => {
		try {
			const req = indexedDB.deleteDatabase(DB_NAME);
			req.onsuccess = req.onerror = req.onblocked = () => resolve();
		} catch {
			resolve();
		}
	});
}

// 沒登入就導到登入頁，登入後回到原本的頁面
export function requireLogin() {
	if (isLoggedIn()) return true;
	location.href = `${base}/login/?next=${encodeURIComponent(location.pathname + location.search)}`;
	return false;
}

// 需要登入的頁面（Layout auth）在 <head> 先把內容藏起來，所有 whenReady 都填完才一起顯示，
// 避免刷新時先閃出預設值（旅人小島、0、空相簿）再跳成真資料
// 頁首和頁面是分開的 module script，等 DOMContentLoaded（所有 script 都開始跑了）才確定沒有別的要等
let holds = 0;
const parsed = typeof document === 'undefined' ? null : new Promise((r) => document.addEventListener('DOMContentLoaded', r, { once: true }));
export async function whenReady(fill: () => Promise<void>) {
	holds++;
	try {
		await fill();
	} finally {
		holds--;
		await parsed;
		if (!holds) delete document.documentElement.dataset.pending;
	}
}

export interface Photo {
	id: number;
	mailboxId: string;
	blob: Blob;
	createdAt: number;
}

type StoreName = 'photos' | 'postcards' | 'avatar';

function openDb() {
	return new Promise<IDBDatabase>((resolve, reject) => {
		// v2：加上明信片、頭像
		const req = indexedDB.open(DB_NAME, 2);
		req.onupgradeneeded = () => {
			for (const name of ['photos', 'postcards'] as const)
				if (!req.result.objectStoreNames.contains(name)) req.result.createObjectStore(name, { keyPath: 'id', autoIncrement: true });
			if (!req.result.objectStoreNames.contains('avatar')) req.result.createObjectStore('avatar');
		};
		req.onsuccess = () => {
			// 重置資料要刪資料庫時先放手，不然 deleteDatabase 會被開著的連線擋住
			req.result.onversionchange = () => req.result.close();
			resolve(req.result);
		};
		req.onerror = () => reject(req.error);
	});
}

function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>, name: StoreName = 'photos') {
	return openDb().then(
		(db) =>
			new Promise<T>((resolve, reject) => {
				const req = fn(db.transaction(name, mode).objectStore(name));
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
async function shrink(file: Blob, max = 1600) {
	const img = await createImageBitmap(file);
	const scale = Math.min(1, max / Math.max(img.width, img.height));
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

export interface Postcard {
	id: number;
	photoId: number;
	mailboxId: string;
	message: string;
	to: string;
	address: string;
	mode: 'friend' | 'future';
	deliverAt?: number; // 寄給未來的自己：指定送達日
	createdAt: number;
}

export async function getPostcards(): Promise<Postcard[]> {
	const all = await tx<Postcard[]>('readonly', (s) => s.getAll(), 'postcards').catch(() => []);
	return all.sort((a, b) => b.createdAt - a.createdAt);
}

// 純前端：不會真的寄出，只記錄在「我的信件」，狀態一直是「寄送中」
export async function addPostcard(card: Omit<Postcard, 'id' | 'createdAt'>) {
	navigator.storage?.persist?.();
	await tx('readwrite', (s) => s.add({ ...card, createdAt: Date.now() }), 'postcards');
}

export interface Profile {
	nickname: string;
	bio: string;
	county: string;
	publicAlbum: boolean;
}

const PROFILE_KEY = 'daoyou:profile';
// 設計稿的預設內容
const DEFAULT_PROFILE: Profile = { nickname: '旅人小島', bio: '喜歡在城市裡找可愛的郵筒，\n收集每一座島嶼的郵戳。', county: 'taipei', publicAlbum: true };

export const getProfile = (): Profile =>
	safe(() => ({ ...DEFAULT_PROFILE, ...JSON.parse(localStorage.getItem(PROFILE_KEY) ?? '{}') }), DEFAULT_PROFILE);

export const saveProfile = (p: Profile) => safe(() => localStorage.setItem(PROFILE_KEY, JSON.stringify(p)), undefined);

// 頭像也是照片，存 IndexedDB（縮到 400px）
export const getAvatar = () => tx<Blob | undefined>('readonly', (s) => s.get('me'), 'avatar').catch(() => undefined);

export async function saveAvatar(file: Blob) {
	const blob = await shrink(file, 400);
	await tx('readwrite', (s) => s.put(blob, 'me'), 'avatar');
}
