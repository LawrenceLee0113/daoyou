// 縣市與特色郵筒資料。新增郵筒時填進 mailboxes，對應的縣市頁就會出現卡片、郵筒頁也會自動產生。
import waiyaoPhoto from '../assets/mailboxes/waiyao.jpg';
import waiyaoIllust from '../assets/mailboxes/waiyao-illust.png';

export type Region = 'north' | 'central' | 'south' | 'east';

export const regions: { id: Region; name: string }[] = [
	{ id: 'north', name: '北部' },
	{ id: 'central', name: '中部' },
	{ id: 'south', name: '南部' },
	{ id: 'east', name: '東部' },
];

// slug 對應 src/data/taiwan-map.json 的 paths；名稱照設計稿 frame 名稱
export const counties: { slug: string; name: string; region: Region }[] = [
	{ slug: 'taipei', name: '台北', region: 'north' },
	{ slug: 'new-taipei', name: '新北', region: 'north' },
	{ slug: 'keelung', name: '基隆', region: 'north' },
	{ slug: 'taoyuan', name: '桃園', region: 'north' },
	{ slug: 'hsinchu', name: '新竹', region: 'north' },
	{ slug: 'yilan', name: '宜蘭', region: 'north' },
	{ slug: 'miaoli', name: '苗栗', region: 'central' },
	{ slug: 'taichung', name: '台中', region: 'central' },
	{ slug: 'changhua', name: '彰化', region: 'central' },
	{ slug: 'nantou', name: '南投', region: 'central' },
	{ slug: 'yunlin', name: '雲林', region: 'central' },
	{ slug: 'chiayi', name: '嘉義', region: 'south' },
	{ slug: 'tainan', name: '台南', region: 'south' },
	{ slug: 'kaohsiung', name: '高雄', region: 'south' },
	{ slug: 'pingtung', name: '屏東', region: 'south' },
	{ slug: 'hualien', name: '花蓮', region: 'east' },
	{ slug: 'taitung', name: '臺東', region: 'east' },
];

export const mailboxes = [
	{
		id: 'waiyao',
		county: 'taipei',
		name: '歪腰郵筒',
		area: '臺北市中山區・南京東路',
		address: '臺北市中山區・南京東路 × 龍江路口',
		summary: '2015 年蘇迪勒颱風吹落招牌，\n砸彎了路邊一紅一綠的郵筒。\n歪腰的模樣意外爆紅，如今\n成了台北最萌的打卡景點。',
		sections: [
			{ title: '颱風留下的微笑', body: '2015 年 8 月蘇迪勒颱風來襲，一塊診所\n招牌被強風吹落，砸中路邊一紅一綠兩座\n郵筒，讓它們朝同一個方向彎下了腰。' },
			{ title: '保留下來的城市記憶', body: '歪腰郵筒在網路上爆紅，民眾排隊合影。\n中華郵政最後決定保留原樣並加固，\n「小紅小綠」從此成了台北的打卡地標。' },
		],
		photo: waiyaoPhoto, // ponytail: 暫用設計稿「歪腰郵筒-相機」裡我們拍的照片，等正式照片
		illustration: waiyaoIllust,
	},
];

export type Mailbox = (typeof mailboxes)[number];

export const countyOf = (slug: string) => counties.find((c) => c.slug === slug)!;
