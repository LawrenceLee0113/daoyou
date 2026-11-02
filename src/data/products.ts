// 在地風味：照抄 i郵購「食品生鮮 › 水果、蔬菜」第 1 頁（2026-11-02，依人氣排序）
// https://www.postmall.com.tw/mallProductList.aspx?kind=517&pkind=1
// 商品照片沒有下載：是各店家的圖，轉貼到公開網站有著作權疑慮，先放假圖並連回 i郵購商品頁
const url = (uid: number, prod: number) => `https://www.postmall.com.tw/productDetail.aspx?uid=${uid}&prod=${prod}`;

export const products = [
	{ name: '115南投埔里睡吊網的[紫蜜]百香果_5斤裝', price: 600, original: 650, shop: '愛莉農場', url: url(3773, 1031708) },
	{ name: '彰化田中珍珠芭樂_5台斤裝', price: 450, original: 550, shop: '芭樂巴巴巴', url: url(4045, 1045429) },
	{ name: '【自然海風果園】115年【臺東大目釋迦禮盒】5台斤裝/盒', price: 520, original: 660, shop: '自然海風果園', url: url(3845, 1038038) },
	{ name: '【好時果子】115年【臺東大目釋迦禮盒】5台斤裝/盒', price: 520, original: 660, shop: '好時果子', url: url(3933, 1038044) },
	{ name: '【易家園】115年【臺東大目釋迦禮盒】5台斤裝/盒', price: 520, original: 660, shop: '易家園', url: url(2867, 1038035) },
	{ name: '[預購]115年彰化二林紅龍果_6台斤裝', price: 550, original: 650, shop: '晞品果園紅龍果(火龍果)', url: url(2838, 1030669) },
	{ name: '115南投埔里睡吊網的百香果_5斤裝', price: 500, original: 560, shop: '愛莉農場', url: url(3773, 1031707) },
	{ name: '115南投埔里睡吊網的百香果_8斤裝', price: 700, original: 780, shop: '愛莉農場', url: url(3773, 1031705) },
	{ name: '115帝王芭樂5台斤裝_大王級(7~9顆)', price: 550, original: 699, shop: '農芒', url: url(3646, 1031164), soldOut: true },
	{ name: '『蓮霧王』紅心芭樂禮盒5台斤(6-12粒)/箱X1箱', price: 399, original: 500, shop: '蓮霧王', url: url(494, 959566) },
	{ name: '115帝王芭樂5台斤裝_霸王級(5~6顆)', price: 650, original: 799, shop: '農芒', url: url(3646, 1031154), soldOut: true },
	{ name: '[101養生堅果館] ((整粒蔓越莓干220克))', price: 180, original: 200, shop: '壹零壹養生堅果館', url: url(2218, 467675) },
	{ name: '►台東特惠組◀ 羅望子果粒 @組 (150g x 5包) 買2組贈1包150g 試吃包 ║總統套房迎賓禮║ 養顏美容，幫助消化!', price: 995, original: 1250, shop: '米物生醫', url: url(3849, 1043333) },
	{ name: '►花蓮特惠組◀ 羅望子果粒 @組 (150g x 5包) 買2組贈1包150g 試吃包 ║總統套房迎賓禮║ 養顏美容，幫助消化!', price: 995, original: 1250, shop: '米物生醫', url: url(3849, 1042706) },
	{ name: '【五桔國際】厚切帶皮馬鈴薯條60g(原味/墨西哥紅椒)X4入', price: 259, original: 400, shop: '五桔', url: url(2874, 1041759) },
	{ name: '酪梨5斤/箱 （轉色_產季8~10月）', price: 499, original: 650, shop: '樂咖田庄農場', url: url(3854, 1018624), soldOut: true },
];
