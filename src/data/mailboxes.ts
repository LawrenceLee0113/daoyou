// 縣市與特色郵筒資料。新增郵筒時填進 mailboxes，對應的縣市頁就會出現卡片、郵筒頁也會自動產生。
// 台中的照片、插圖用使用者提供的「網站放的圖片」；台北的照片暫用設計稿匯出的（提供的版本解析度較低）
import waiyaoPhoto from '../assets/mailboxes/waiyao.jpg';
import waiyaoCard from '../assets/mailboxes/waiyao-card.jpg';
import waiyaoIllust from '../assets/mailboxes/waiyao-illust.png';
import xinshePhoto from '../assets/mailboxes/xinshe.jpg';
import xinsheCard from '../assets/mailboxes/xinshe-card.jpg';
import xinsheIllust from '../assets/mailboxes/xinshe-illust.png';
import beimenCard from '../assets/mailboxes/beimen-card.jpg';
import beimenIllust from '../assets/mailboxes/beimen-illust.png';
import goldUtaipeiCard from '../assets/mailboxes/gold-utaipei-card.jpg';
import goldUtaipeiIllust from '../assets/mailboxes/gold-utaipei-illust.png';
import goldMinquanCard from '../assets/mailboxes/gold-minquan-card.jpg';
import goldMinquanIllust from '../assets/mailboxes/gold-minquan-illust.png';
import beitouCard from '../assets/mailboxes/beitou-card.jpg';
import beitouIllust from '../assets/mailboxes/beitou-illust.png';

// 順序照設計稿郵票冊（北→南，宜花東在最後）。slug 對應 src/data/taiwan-map.json 的 paths。name：「← 返回台北」這類短名；fullName：地圖標籤、縣市頁大標
export const counties: { slug: string; name: string; fullName: string }[] = [
	{ slug: 'taipei', name: '台北', fullName: '臺北市' },
	{ slug: 'new-taipei', name: '新北', fullName: '新北市' },
	{ slug: 'keelung', name: '基隆', fullName: '基隆市' },
	{ slug: 'taoyuan', name: '桃園', fullName: '桃園市' },
	{ slug: 'hsinchu', name: '新竹', fullName: '新竹縣' },
	{ slug: 'miaoli', name: '苗栗', fullName: '苗栗縣' },
	{ slug: 'taichung', name: '台中', fullName: '臺中市' },
	{ slug: 'changhua', name: '彰化', fullName: '彰化縣' },
	{ slug: 'nantou', name: '南投', fullName: '南投縣' },
	{ slug: 'yunlin', name: '雲林', fullName: '雲林縣' },
	{ slug: 'chiayi', name: '嘉義', fullName: '嘉義縣' },
	{ slug: 'tainan', name: '台南', fullName: '臺南市' },
	{ slug: 'kaohsiung', name: '高雄', fullName: '高雄市' },
	{ slug: 'pingtung', name: '屏東', fullName: '屏東縣' },
	{ slug: 'yilan', name: '宜蘭', fullName: '宜蘭縣' },
	{ slug: 'hualien', name: '花蓮', fullName: '花蓮縣' },
	{ slug: 'taitung', name: '臺東', fullName: '臺東縣' },
];

export const mailboxes = [
	{
		id: 'waiyao',
		county: 'taipei',
		name: '歪腰郵筒',
		nickname: '小紅小綠', // 明信片「小紅小綠會把你的心意送到…」
		postmark: ['台北', '中山'],
		area: '臺北市中山區・南京東路',
		address: '臺北市中山區・南京東路 × 龍江路口',
		summary: '2015 年蘇迪勒颱風吹落招牌，\n砸彎了路邊一紅一綠的郵筒。\n歪腰的模樣意外爆紅，\n如今成了台北最萌的打卡景點。',
		sections: [
			{ title: '颱風留下的微笑', body: '2015 年 8 月蘇迪勒颱風來襲，一塊診所\n招牌被強風吹落，砸中路邊一紅一綠兩座\n郵筒，讓它們朝同一個方向彎下了腰。' },
			{ title: '保留下來的城市記憶', body: '歪腰郵筒在網路上爆紅，民眾排隊合影。\n中華郵政最後決定保留原樣並加固，\n「小紅小綠」從此成了台北的打卡地標。' },
		],
		photo: waiyaoPhoto,
		cardPhoto: waiyaoCard,
		illustration: waiyaoIllust,
	},
	{
		id: 'xinshe',
		county: 'taichung',
		name: '菇鴿寄幸福',
		nickname: '菇鴿',
		postmark: ['台中', '新社'],
		area: '臺中市新社區・協中街',
		address: '臺中市新社區・協中街（新社香菇街/菇神旁）',
		summary: '結合新社在地香菇產業與郵政意象，可愛的「菇鴿」公仔抱著特色郵筒佇立於香菇街旁，成為旅人走訪新社必拍的萌系地圖標誌。',
		sections: [
			{ title: '新社最萌的幸福大使', body: '結合新社在地香菇產業與郵政意象，可愛的\n「菇鴿」公仔抱著特色郵筒佇立於香菇街旁，\n成為旅人走訪新社必拍的萌系地圖標誌。' },
			{ title: '把香菇與幸福一起寄出', body: '這裡不只紀錄了在地農產的豐饒，更象徵著\n手寫信件的溫暖傳遞。來到香菇的故鄉，不\n妨駐足投封信，把山城的清新與幸福分享給\n遠方的朋友。' },
		],
		photo: xinshePhoto,
		cardPhoto: xinsheCard,
		illustration: xinsheIllust,
	},
];

export type Mailbox = (typeof mailboxes)[number];

// 設計稿縣市頁有卡片、但還沒有詳細頁的郵筒：只出現在縣市頁卡片，不能打卡（地圖、郵票冊、明信片都不算）。
// 要開放時補上 nickname、postmark、address、sections、photo，搬到上面的 mailboxes 就會產生郵筒頁。
// 照片從設計稿匯出（使用者提供的版本解析度較低），插圖用使用者提供的「網站放的圖片」
export const upcoming = [
	{
		id: 'beimen',
		county: 'taipei',
		name: '北門老郵筒',
		area: '臺北市中正區光復里忠孝西路1段114號',
		summary: '北門旁的圓柱形懷舊郵筒，\n仿製自平溪郵局全臺使用中歷史最悠久的老郵筒。\n它與臺北郵局的古蹟建築相映成趣，\n彷彿將時光裝進信封，帶領旅人走入臺北西區的昔日風華。',
		cardPhoto: beimenCard,
		illustration: beimenIllust,
	},
	{
		id: 'gold-utaipei',
		county: 'taipei',
		name: '中華郵政奧運金牌郵筒',
		area: '臺北市中正區建國里愛國西路一號',
		summary: '為紀念「麟洋配」王齊麟與李洋於2021年\n東京奧運勇奪臺灣首面羽球男子雙打金牌，\n中華郵政特別於兩人母校\n臺北市立大學設置金色郵筒，\n象徵奪金榮耀，留下珍貴的歷史紀念。',
		cardPhoto: goldUtaipeiCard,
		illustration: goldUtaipeiIllust,
	},
	{
		id: 'gold-minquan',
		county: 'taipei',
		name: '中華郵政奧運金牌郵筒',
		area: '臺北市松山區三民里民權東路四段200號',
		summary: '從東京首金到巴黎衛冕，\n「麟洋配」王齊麟與李洋兩度寫下臺灣羽球傳奇。\n中華郵政特別於王齊麟母校民權國小設置金色郵筒，\n以耀眼金色象徵雙金榮耀，承載奮鬥的足跡，\n也將這份感動與驕傲永遠留存。',
		cardPhoto: goldMinquanCard,
		illustration: goldMinquanIllust,
	},
	{
		id: 'beitou',
		county: 'taipei',
		name: '新北投火車站特色郵筒',
		area: '臺北市北投區中心里七星街1號',
		summary: '走出新北投捷運站，\n七星公園裡藏著一座化身復古列車的特色郵筒。\n佇立於百年新北投車站旁，\n它承載著昔日鐵道的歲月記憶，\n讓每封寄出的信件，都彷彿搭上穿越時光的列車。',
		cardPhoto: beitouCard,
		illustration: beitouIllust,
	},
];

export const countyOf = (slug: string) => counties.find((c) => c.slug === slug)!;
