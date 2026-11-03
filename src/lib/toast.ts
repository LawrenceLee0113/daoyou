// 畫面最下方跳出的通知（取代 alert）。同時只留一則，新的蓋掉舊的；點一下（不是連結時）就收起來
let current: HTMLElement | undefined;
let timer = 0;

export function toast(text: string, { href, ms = 2000, error = false }: { href?: string; ms?: number; error?: boolean } = {}) {
	current?.remove();
	clearTimeout(timer);
	const el = document.createElement(href ? 'a' : 'p');
	if (href) (el as HTMLAnchorElement).href = href;
	else el.addEventListener('click', () => el.remove());
	el.setAttribute('role', error ? 'alert' : 'status');
	el.className =
		'toast-in fixed inset-x-0 bottom-[calc(2rem+env(safe-area-inset-bottom))] z-50 mx-auto flex min-h-11 w-fit max-w-[calc(100%-32px)] min-w-[274px] items-center justify-center rounded-3xl bg-toast px-5 py-2.5 text-center text-md font-bold whitespace-pre-line text-white';
	// 開著的 modal dialog 在最上層，放 body 會被蓋住
	(document.querySelector('dialog[open]') ?? document.body).append(el);
	// 先放進畫面再填字，螢幕閱讀器才會念出來
	requestAnimationFrame(() => (el.textContent = text));
	current = el;
	timer = setTimeout(() => {
		el.classList.replace('toast-in', 'fade-out');
		setTimeout(() => el.remove(), 300);
	}, ms);
}
