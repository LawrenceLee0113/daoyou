// 縣市與特色郵筒資料。新增郵筒時填進 mailboxes，對應的縣市頁就會出現卡片、郵筒頁也會自動產生。
// 台中的照片、插圖用使用者提供的「網站放的圖片」；台北的照片暫用設計稿匯出的（提供的版本解析度較低）
// 設計稿只畫了歪腰、新社的詳細頁。其他郵筒（beimen 以後）的 nickname、postmark、address、sections 是依卡片簡介
// 自行撰寫的暫定文案（使用者 2026-11-04 要求每張卡片都能點進去），業主有正式文案再換；photo 沿用卡片照片
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
import wanliCrabCard from '../assets/mailboxes/wanli-crab-card.jpg';
import wanliCrabIllust from '../assets/mailboxes/wanli-crab-illust.png';
import pingxiLanternCard from '../assets/mailboxes/pingxi-lantern-card.jpg';
import pingxiLanternIllust from '../assets/mailboxes/pingxi-lantern-illust.png';
import goldYinggeCard from '../assets/mailboxes/gold-yingge-card.jpg';
import goldYinggeIllust from '../assets/mailboxes/gold-yingge-illust.png';
import taoyuanChenggongCard from '../assets/mailboxes/taoyuan-chenggong-card.jpg';
import taoyuanChenggongIllust from '../assets/mailboxes/taoyuan-chenggong-illust.png';
import shunfengErCard from '../assets/mailboxes/shunfeng-er-card.jpg';
import shunfengErIllust from '../assets/mailboxes/shunfeng-er-illust.png';
import swordLionCard from '../assets/mailboxes/sword-lion-card.jpg';
import swordLionIllust from '../assets/mailboxes/sword-lion-illust.png';
import anpingSwordLionCard from '../assets/mailboxes/anping-sword-lion-card.jpg';
import anpingSwordLionIllust from '../assets/mailboxes/anping-sword-lion-illust.png';
import catMessengerCard from '../assets/mailboxes/cat-messenger-card.jpg';
import catMessengerIllust from '../assets/mailboxes/cat-messenger-illust.png';
import moonOwlCard from '../assets/mailboxes/moon-owl-card.jpg';
import moonOwlIllust from '../assets/mailboxes/moon-owl-illust.png';
import octopusCard from '../assets/mailboxes/octopus-card.jpg';
import octopusIllust from '../assets/mailboxes/octopus-illust.png';
import hlaaluaCard from '../assets/mailboxes/hlaalua-card.jpg';
import hlaaluaIllust from '../assets/mailboxes/hlaalua-illust.png';
import kanakanavuCard from '../assets/mailboxes/kanakanavu-card.jpg';
import kanakanavuIllust from '../assets/mailboxes/kanakanavu-illust.png';
import hlaaluaPhoto from '../assets/mailboxes/hlaalua.jpg';
import kanakanavuPhoto from '../assets/mailboxes/kanakanavu.jpg';

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
	{
		id: 'beimen',
		county: 'taipei',
		name: '北門老郵筒',
		area: '臺北市中正區光復里忠孝西路1段114號',
		summary: '北門旁的圓柱形懷舊郵筒，\n仿製自平溪郵局全臺使用中歷史最悠久的老郵筒。\n它與臺北郵局的古蹟建築相映成趣，\n彷彿將時光裝進信封，帶領旅人走入臺北西區的昔日風華。',
		nickname: '老郵筒',
		postmark: ['台北', '中正'],
		address: '臺北市中正區光復里忠孝西路1段114號',
		sections: [
			{ title: '仿製百年老郵筒', body: '北門旁的圓柱形懷舊郵筒，仿製自平溪郵局\n全臺使用中歷史最悠久的老郵筒，\n墨綠色的圓筒身留著舊時代的樣貌。' },
			{ title: '與古蹟相映的街角', body: '它與臺北郵局的古蹟建築相映成趣，\n逛完北門與西區老街，不妨在這裡寄出\n一封信，把時光裝進信封帶回家。' },
		],
		photo: beimenCard,
		cardPhoto: beimenCard,
		illustration: beimenIllust,
	},
	{
		id: 'gold-utaipei',
		county: 'taipei',
		name: '中華郵政奧運金牌郵筒',
		area: '臺北市中正區建國里愛國西路一號',
		summary: '為紀念「麟洋配」王齊麟與李洋於2021年\n東京奧運勇奪臺灣首面羽球男子雙打金牌，\n中華郵政特別於兩人母校\n臺北市立大學設置金色郵筒，\n象徵奪金榮耀，留下珍貴的歷史紀念。',
		nickname: '金牌郵筒',
		postmark: ['台北', '中正'],
		address: '臺北市中正區建國里愛國西路一號（臺北市立大學）',
		sections: [
			{ title: '紀念麟洋配東京奪金', body: '為紀念「麟洋配」王齊麟與李洋於 2021 年\n東京奧運勇奪臺灣首面羽球男子雙打金牌，\n中華郵政在兩人的母校臺北市立大學\n設置了這座金色郵筒。' },
			{ title: '寄出一份榮耀', body: '金光閃閃的筒身象徵奪金的榮耀，\n來這裡投一封信替選手加油，\n也替自己的目標許下一個願望。' },
		],
		photo: goldUtaipeiCard,
		cardPhoto: goldUtaipeiCard,
		illustration: goldUtaipeiIllust,
	},
	{
		id: 'gold-minquan',
		county: 'taipei',
		name: '中華郵政奧運金牌郵筒',
		area: '臺北市松山區三民里民權東路四段200號',
		summary: '從東京首金到巴黎衛冕，\n「麟洋配」王齊麟與李洋兩度寫下臺灣羽球傳奇。\n中華郵政特別於王齊麟母校民權國小設置金色郵筒，\n以耀眼金色象徵雙金榮耀，承載奮鬥的足跡，\n也將這份感動與驕傲永遠留存。',
		nickname: '金牌郵筒',
		postmark: ['台北', '松山'],
		address: '臺北市松山區三民里民權東路四段200號（民權國小）',
		sections: [
			{ title: '從東京到巴黎', body: '從東京首金到巴黎衛冕，「麟洋配」\n王齊麟與李洋兩度寫下臺灣羽球傳奇。\n中華郵政特別在王齊麟的母校民權國小\n設置了金色郵筒。' },
			{ title: '雙金的感動', body: '耀眼的金色象徵雙金榮耀，\n承載著奮鬥的足跡，\n也把這份感動與驕傲留在校園旁。' },
		],
		photo: goldMinquanCard,
		cardPhoto: goldMinquanCard,
		illustration: goldMinquanIllust,
	},
	{
		id: 'beitou',
		county: 'taipei',
		name: '新北投火車站特色郵筒',
		area: '臺北市北投區中心里七星街1號',
		summary: '走出新北投捷運站，\n七星公園裡藏著一座化身復古列車的特色郵筒。\n佇立於百年新北投車站旁，\n它承載著昔日鐵道的歲月記憶，\n讓每封寄出的信件，都彷彿搭上穿越時光的列車。',
		nickname: '小火車',
		postmark: ['台北', '北投'],
		address: '臺北市北投區中心里七星街1號（七星公園）',
		sections: [
			{ title: '化身復古列車', body: '走出新北投捷運站，七星公園裡藏著\n一座化身復古列車的特色郵筒，\n火車頭造型一眼就能認出來。' },
			{ title: '搭上時光列車', body: '它佇立於百年新北投車站旁，承載著\n昔日鐵道的歲月記憶，讓每封寄出的信，\n都彷彿搭上穿越時光的列車。' },
		],
		photo: beitouCard,
		cardPhoto: beitouCard,
		illustration: beitouIllust,
	},
	// v5 新增：新北、桃園、台南、高雄。文案照設計稿；照片是業主 2026-11-03 提供的（設計稿有放的用設計稿的裁切匯出，
	// 設計稿沒放的鐵道天燈、鶯歌金牌、章魚自己裁 4:3），插圖是業主提供的「郵筒們」
	{
		id: 'wanli-crab',
		county: 'new-taipei',
		name: '螃蟹郵筒',
		area: '新北市萬里區・野柳漁港／萬里蟹產區',
		summary: '結合萬里在地最著名的「萬里蟹」海鮮意象，立體大螃蟹抱著綠色郵筒的造型極具趣味，充滿濃濃的港灣海洋風情。',
		nickname: '萬里蟹',
		postmark: ['新北', '萬里'],
		address: '新北市萬里區・野柳漁港／萬里蟹產區',
		sections: [
			{ title: '港邊的大螃蟹', body: '結合萬里在地最著名的「萬里蟹」意象，\n立體大螃蟹抱著綠色郵筒，\n瞪大的眼睛和大螯造型極具趣味。' },
			{ title: '寄一封海風味的信', body: '逛完野柳、吃完萬里蟹，\n別忘了在這裡寄張明信片，\n把港灣的海洋風情分享給遠方的朋友。' },
		],
		photo: wanliCrabCard,
		cardPhoto: wanliCrabCard,
		illustration: wanliCrabIllust,
	},
	{
		id: 'pingxi-lantern',
		county: 'new-taipei',
		name: '鐵道天燈郵筒',
		area: '新北市平溪區・平溪車站／菁桐車站旁',
		summary: '結合平溪經典的天燈文化與鐵道風情，天燈造型的特色郵筒佇立於山城鐵道旁，成為造訪平溪、菁桐時必拍的標誌性打卡點。',
		nickname: '天燈郵筒',
		postmark: ['新北', '平溪'],
		address: '新北市平溪區・平溪車站／菁桐車站旁',
		sections: [
			{ title: '天燈與鐵道', body: '結合平溪經典的天燈文化與鐵道風情，\n天燈造型的特色郵筒佇立於山城鐵道旁，\n是造訪平溪、菁桐必拍的打卡點。' },
			{ title: '把願望一起寄出', body: '在平溪，人們把願望寫在天燈上放飛；\n你也可以把想說的話寫進信裡，\n讓這座天燈郵筒替你送到遠方。' },
		],
		photo: pingxiLanternCard,
		cardPhoto: pingxiLanternCard,
		illustration: pingxiLanternIllust,
	},
	{
		id: 'gold-yingge',
		county: 'new-taipei',
		name: '中華郵政奧運金牌郵筒',
		area: '新北市鶯歌區・尖山埔路（鶯歌國中對面）',
		summary: '為紀念「臺灣拳后」林郁婷於 2024 年巴黎奧運勇奪臺灣首面拳擊金牌，中華郵政特別於母校鶯歌國中對面設置金色郵筒，象徵奪金榮耀，留下珍貴的歷史紀念。',
		nickname: '金牌郵筒',
		postmark: ['新北', '鶯歌'],
		address: '新北市鶯歌區・尖山埔路（鶯歌國中對面）',
		sections: [
			{ title: '臺灣拳后的金牌', body: '為紀念「臺灣拳后」林郁婷於 2024 年\n巴黎奧運勇奪臺灣首面拳擊金牌，\n中華郵政在她的母校鶯歌國中對面\n設置了金色郵筒。' },
			{ title: '老街旁的榮耀', body: '逛鶯歌老街時不妨順路來看看，\n金色的筒身象徵奪金榮耀，\n也為小鎮留下珍貴的歷史紀念。' },
		],
		photo: goldYinggeCard,
		cardPhoto: goldYinggeCard,
		illustration: goldYinggeIllust,
	},
	{
		id: 'taoyuan-chenggong',
		county: 'taoyuan',
		name: '一般特色郵筒',
		area: '桃園市桃園區・文昌里成功路一段',
		summary: '坐落於桃園成功路郵局前，\n這座特色郵筒融合桃園77藝文町的復古風情\n與99網美牆的設計巧思。兩側設有造型座椅，\n讓旅人在城市街角稍作停留，\n將寄信的溫度化為值得收藏的旅行記憶。',
		nickname: '粉綠郵筒',
		postmark: ['桃園', '桃園'],
		address: '桃園市桃園區・文昌里成功路一段（成功路郵局前）',
		sections: [
			{ title: '復古風情的街角', body: '坐落於桃園成功路郵局前，這座特色郵筒\n融合桃園77藝文町的復古風情\n與99網美牆的設計巧思。' },
			{ title: '坐下來寫張明信片', body: '郵筒兩側設有造型座椅，\n讓旅人在城市街角稍作停留，\n將寄信的溫度化為值得收藏的旅行記憶。' },
		],
		photo: taoyuanChenggongCard,
		cardPhoto: taoyuanChenggongCard,
		illustration: taoyuanChenggongIllust,
	},
	{
		id: 'shunfeng-er',
		county: 'tainan',
		name: '順風耳',
		area: '臺南市安南區東和里・長和路一段',
		summary: '結合傳統廟宇文化中媽祖駕前的「順風耳」與「千里眼」神將意象，將傳統神明公仔與紅綠郵筒相結合，展現濃厚的府城信仰魅力。',
		nickname: '順風耳',
		postmark: ['台南', '安南'],
		address: '臺南市安南區東和里・長和路一段',
		sections: [
			{ title: '媽祖駕前的神將', body: '結合傳統廟宇文化中媽祖駕前的\n「順風耳」與「千里眼」神將意象，\n將神明公仔與紅綠郵筒相結合。' },
			{ title: '府城的信仰魅力', body: '一個聽得遠、一個看得遠，\n讓寄出的心意不會走丟。\n來臺南走走，感受濃厚的府城信仰魅力。' },
		],
		photo: shunfengErCard,
		cardPhoto: shunfengErCard,
		illustration: shunfengErIllust,
	},
	{
		id: 'sword-lion',
		county: 'tainan',
		name: '劍獅郵筒',
		area: '臺南市北區公園里・成功路',
		// 使用者 2026-11-04：劍獅郵筒有兩座，這座是北區臺南郵局前的彩繪版；設計稿的簡介寫的是安平那座，搬到 anping-sword-lion，這裡自己寫（暫定）
		summary: '臺南郵局前的一對紅綠郵筒，筒身彩繪上安平劍獅的威武面孔，不用走到安平，在市區也能和劍獅合照。',
		nickname: '劍獅',
		postmark: ['台南', '北區'],
		address: '臺南市北區公園里・成功路（臺南郵局前）',
		sections: [
			{ title: '郵局前的劍獅臉', body: '臺南郵局前的一對紅綠郵筒，\n筒身彩繪上安平劍獅的威武面孔，\n咬著寶劍守護每一封信。' },
			{ title: '市區就能遇見劍獅', body: '不用走到安平，在市區辦完郵務\n就能順便和劍獅合照，\n再寄一封帶著府城味道的信。' },
		],
		photo: swordLionCard,
		cardPhoto: swordLionCard,
		illustration: swordLionIllust,
	},
	{
		id: 'anping-sword-lion',
		county: 'tainan',
		name: '安平劍獅郵筒',
		area: '臺南市安平區', // 查不到確切位置，等業主補
		summary: '結合安平在地數百年傳承的「劍獅」民俗文化與郵政意象，將鮮豔彩繪與立體劍獅造型融入郵筒設計，成為造訪安平古堡與老街巷弄時必拍的古都文化地標。',
		nickname: '安平劍獅',
		postmark: ['台南', '安平'],
		address: '臺南市安平區',
		sections: [
			{ title: '安平的守護神', body: '「劍獅」是安平流傳數百年的民俗文化，\n郵筒將鮮豔彩繪與立體劍獅造型\n融入設計，紅綠兩座威風凜凜。' },
			{ title: '古都的文化地標', body: '造訪安平古堡與老街巷弄之餘，\n別忘了和劍獅郵筒合照，\n再寄一封帶著古都味道的信。' },
		],
		photo: anpingSwordLionCard,
		cardPhoto: anpingSwordLionCard, // ponytail: 業主給的「台南-2備用」只有 338px，有大圖再換
		illustration: anpingSwordLionIllust,
	},
	{
		id: 'cat-messenger',
		county: 'kaohsiung',
		name: '橘貓信差郵筒',
		area: '高雄市甲仙區・甲仙郵局旁（貓巷）',
		summary: '甲仙郵局於巷道（當地暱稱貓巷）特別設置「橘貓信差」特色郵筒，將趣味的橘貓公仔與郵政意象結合，為小鎮增添豐富的人文色彩，成為相合照的熱門景點。',
		nickname: '橘貓信差',
		postmark: ['高雄', '甲仙'],
		address: '高雄市甲仙區・甲仙郵局旁（貓巷）', // 設計稿寫橋頭區，使用者 2026-11-04 更正為甲仙區
		sections: [
			{ title: '巷弄裡的橘貓', body: '在當地暱稱「貓巷」的巷道裡，\n特別設置了「橘貓信差」特色郵筒，\n戴著郵差帽的橘貓公仔十分討喜。' },
			{ title: '和信差合照', body: '趣味的橘貓公仔與郵政意象結合，\n為小鎮增添豐富的人文色彩，\n成為旅人合照的熱門景點。' },
		],
		photo: catMessengerCard,
		cardPhoto: catMessengerCard,
		illustration: catMessengerIllust,
	},
	{
		id: 'moon-owl',
		county: 'kaohsiung',
		name: '月光精靈貓頭鷹郵筒',
		area: '高雄市杉林區・月眉里／杉林郵局周邊',
		summary: '結合杉林在地布農族與原住民族傳說中代表吉祥與幸福的貓頭鷹意象，大大的圓眼睛與立體羽毛造型，佇立在山城間非常吸睛。',
		nickname: '貓頭鷹',
		postmark: ['高雄', '杉林'],
		address: '高雄市杉林區・月眉里／杉林郵局周邊',
		sections: [
			{ title: '山城的吉祥鳥', body: '結合杉林在地布農族與原住民族傳說中\n代表吉祥與幸福的貓頭鷹意象，\n佇立在山城間非常吸睛。' },
			{ title: '大眼睛守著信件', body: '大大的圓眼睛與立體羽毛造型，\n像是替大家守護著每一封信，\n把山城的祝福送到遠方。' },
		],
		photo: moonOwlCard,
		cardPhoto: moonOwlCard,
		illustration: moonOwlIllust,
	},
	{
		id: 'octopus',
		county: 'kaohsiung',
		name: '章魚郵筒',
		area: '高雄市梓官區・信蚵里港九街68號（梓官蚵仔寮郵局外）',
		summary: '蚵仔寮郵局因鄰近漁港，於新局屋落成啟用時特別設置「章魚郵筒」（限時與普通郵筒各一座）。粉黃雙色的章魚公仔呈現出活潑的海洋人文特色，成為在地獨特的觀光亮點。',
		nickname: '章魚',
		postmark: ['高雄', '梓官'],
		address: '高雄市梓官區・信蚵里港九街68號（梓官蚵仔寮郵局外）',
		sections: [
			{ title: '漁港邊的章魚', body: '蚵仔寮郵局因鄰近漁港，\n在新局屋落成啟用時特別設置\n「章魚郵筒」，限時與普通郵筒各一座。' },
			{ title: '粉黃雙色的海洋風情', body: '粉色與黃色的章魚公仔抱著郵筒，\n呈現出活潑的海洋人文特色，\n成為在地獨特的觀光亮點。' },
		],
		photo: octopusCard,
		cardPhoto: octopusCard, // ponytail: 業主給的原圖只有 396px 寬，有大張的再換
		illustration: octopusIllust,
	},
	{
		id: 'hlaalua',
		county: 'kaohsiung',
		name: '拉阿魯哇族郵筒',
		area: '高雄市桃源區 / 那瑪夏區',
		summary: '郵筒以「拉阿魯哇族聖貝祭」為設計核心，將神聖貝殼「takiaru」作為主要文化元素，結合部落傳統圖紋與色彩，呈現族群獨特的祭儀文化與敬畏自然、祖靈的精神。',
		nickname: '拉阿魯哇郵筒',
		postmark: ['高雄', '桃源'],
		address: '高雄市桃源區 / 那瑪夏區',
		sections: [
			{ title: '聖貝祭的意象', body: '郵筒以「拉阿魯哇族聖貝祭」為設計核心，\n將神聖貝殼「takiaru」\n作為主要的文化元素。' },
			{ title: '敬畏自然與祖靈', body: '結合部落傳統圖紋與色彩，\n呈現族群獨特的祭儀文化，\n以及敬畏自然、祖靈的精神。' },
		],
		photo: hlaaluaPhoto,
		cardPhoto: hlaaluaCard,
		illustration: hlaaluaIllust,
	},
	{
		id: 'kanakanavu',
		county: 'kaohsiung',
		name: '卡那卡那富族文化特色郵筒',
		area: '高雄市那瑪夏區・瑪雅部落／達卡努瓦部落',
		summary: '郵筒以臺灣原住民族第 16 族「卡那卡那富族（Kanakanavu）」的文化意象為設計核心，融入部落傳統服飾、織紋色彩與米呼彌濃（Mi humisang）的問候精神，展現族人對自然與土地的深厚情感。',
		nickname: '卡那卡那富郵筒',
		postmark: ['高雄', '那瑪夏'],
		address: '高雄市那瑪夏區・瑪雅部落／達卡努瓦部落',
		sections: [
			{ title: '第 16 族的文化意象', body: '郵筒以臺灣原住民族第 16 族\n「卡那卡那富族（Kanakanavu）」\n的文化意象為設計核心。' },
			{ title: '米呼彌濃的問候', body: '融入部落傳統服飾、織紋色彩\n與米呼彌濃（Mi humisang）的問候精神，\n展現族人對自然與土地的深厚情感。' },
		],
		photo: kanakanavuPhoto,
		cardPhoto: kanakanavuCard,
		illustration: kanakanavuIllust,
	},
];

export type Mailbox = (typeof mailboxes)[number];

export const countyOf = (slug: string) => counties.find((c) => c.slug === slug)!;
