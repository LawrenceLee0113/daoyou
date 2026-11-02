// 郵政知識：4 篇文章。文案照設計稿原文（scan_text_nodes），卡片圖從 Figma 匯出
import card1 from '../assets/knowledge/card-1.png';
import card2 from '../assets/knowledge/card-2.png';
import card3 from '../assets/knowledge/card-3.png';
import card4 from '../assets/knowledge/card-4.png'; // ponytail: 外掛只匯得出上半部，請設計師另外匯出完整的卡片
import bgYellow from '../assets/knowledge/bg-yellow.png';
import bgSage from '../assets/knowledge/bg-sage.png';
import illust1 from '../assets/knowledge/illust-1.png';
import illust2 from '../assets/knowledge/illust-2.png';
import illust3 from '../assets/knowledge/illust-3.png';
import illust4 from '../assets/knowledge/illust-4.png';

// illustrationAt：bottom＝內文右下角的小插圖；behind＝淡淡地墊在內文後面（第二篇的台灣地圖）
export const articles = [
	{
		slug: 'origin',
		title: '一、郵筒的起源',
		card: card1,
		background: bgYellow,
		illustration: illust1,
		illustrationAt: 'bottom' as 'bottom' | 'behind',
		body: '：從一隻靴子開始的故事\n相傳西元 1488 年，一位葡萄牙航海家在探險途中遭遇船難，返航前，他將寫好的信放進自己的靴子裡，掛在海邊的樹枝上，希望失散的同伴有一天能夠找到這封信。然而，靴子在海邊歷經數年風雨，直到另一位葡萄牙航海士偶然發現其中的信件。為了紀念遇難的同胞，他在當地修建教堂，這段故事也逐漸流傳下來。據說，當時的船員便沿用靴子作為傳遞訊息的容器。\n\n雖然這段故事的歷史真實性仍有待考證，但它呈現了人們最初對於傳遞訊息的渴望——即使相隔遙遠，也希望自己的心意能被另一個人收到。\n在中國，古代也有利用竹筒傳遞詩文與訊息的說法。隨著交通與郵政制度逐步發展，傳遞信件的方式日益完善，郵筒也逐漸成為現代郵政系統中不可或缺的一部分。',
	},
	{
		slug: 'history',
		title: '二、臺灣郵筒的歷史演變',
		card: card2,
		background: bgSage,
		illustration: illust2,
		illustrationAt: 'behind' as 'bottom' | 'behind',
		body: '隨著近代郵政制度傳入，郵筒在臺灣逐漸普及，\n其外型、材質與功能也隨著時代需求不斷改變。\n\n早期的郵筒多以鑄鐵製作，外型以圓柱狀為主，雖然堅固，卻有體積龐大、重量重及收信不便等問題。後來，郵筒逐漸改為方柱型，材質也從木材、水泥演變為鋼板及玻璃纖維，以提升耐用度、降低維護成本，並適應臺灣潮濕多雨的氣候。\n郵筒的設計也會因應郵政業務而改變。\n\n1947 年，中華郵政推出「趕班信筒」，以黃色作為醒目的識別色，方便郵務人員迅速辨認並收取需要趕班處理的郵件。1956 年，雙口信筒問世，以黃、綠兩色區分本地與外埠郵件，簡化郵局的分類作業；後續也出現以不同顏色區分普通、限時等郵件的設計。\n此外，1952 年臺北市曾設置「自助郵亭」，提供郵票、郵簡及明信片等郵政用品，讓民眾能自行購買郵政用品、書寫信件並投入郵筒。臺灣也曾出現設置於客運車輛上的「汽車郵箱」，以及專門收寄平常包裹的「平包郵筒」，展現郵政服務因應不同時代與地域需求所發展出的多元形式。\n從外型、材質到顏色與功能，郵筒的每一次改變，都反映了當時的生活方式、郵政需求與設計思維。',
	},
	{
		slug: 'landmark',
		title: '三、從郵政設施到地方特色',
		card: card3,
		background: bgYellow,
		illustration: illust3,
		illustrationAt: 'bottom' as 'bottom' | 'behind',
		body: '隨著數位通訊普及，實體書信的使用逐漸減少，\n郵筒也不再只是日常生活中收寄信件的工具。\n\n有些郵筒因特殊造型、歷史背景或地方故事，逐漸成為具有辨識度的文化地標。\n例如，新北市平溪郵局前具有數十年歷史的直立式鑄鐵郵筒，以及屏東恆春因電影《海角七號》而受到關注的「阿嘉的家」門前懷舊信筒，都成為地方旅遊與文化記憶的一部分。它們的價值不僅在於郵件收寄功能，更來自人們對地方、歷史及影視故事的情感連結。\n\n這些特色郵筒就像一枚枚時光戳印，記錄著不同年代的生活軌跡，也讓原本平凡的街道多了一份值得探索的故事。即使實際使用率不如以往，它們仍能吸引人們停下腳步、拍照留念，甚至能成為認識一座城市的起點。',
	},
	{
		slug: 'culture',
		title: '四、郵筒的文化價值',
		card: card4,
		background: bgSage,
		illustration: illust4,
		illustrationAt: 'bottom' as 'bottom' | 'behind',
		body: '從最初承載訊息的容器，到今日街頭常見的郵政設施，郵筒始終和人們傳遞著訊息、分享情感的需求緊密相連。\n在數位通訊快速發展的時代，訊息可以即時傳送，卻也讓實體書信的獨特性更加珍貴。\n\n一張明信片不僅能記錄當下的心情，也能透過文字、圖像與寄送過程，留下具有溫度的交流體驗。\n因此，郵筒的價值不應只停留在郵政功能，更可以延伸至地方文化的保存與情感的傳遞。\n\n透過認識各地特色郵筒背後的歷史、景觀與人文故事，人們能重新發現地方的魅力，並建立與土地更深的連結。\n郵筒不只是收寄信件的設施，更是地方文化的入口，也是人們寄託心意、傳遞故事與保存共同記憶的媒介。',
	},
];
