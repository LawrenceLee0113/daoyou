// 產生 src/data/taiwan-map.json（臺灣本島各縣市的 SVG path）。只有地圖資料要更新時才需要跑：
//   npm i --no-save taiwan-atlas topojson-client topojson-simplify d3-geo && node scripts/gen-taiwan-map.mjs
// 資料來源：內政部國土測繪中心「直轄市、縣市界線（TWD97經緯度）」1:10000，政府資料開放授權條款第 1 版
// （https://data.gov.tw/license），經 taiwan-atlas（MIT）轉成 TopoJSON。
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { feature } from 'topojson-client';
import { presimplify, simplify } from 'topojson-simplify';
import { geoMercator, geoPath, geoArea } from 'd3-geo';

const require = createRequire(import.meta.url);
const topo = JSON.parse(readFileSync(require.resolve('taiwan-atlas/counties-10t.json'), 'utf8'));

// 設計稿把新竹縣市、嘉義縣市各合成一塊；離島（澎湖、金門、連江）不畫
// 用 COUNTYID 對應（資料裡的名稱是「台北市」「臺北市」混用）
const COUNTIES = {
	A: 'taipei', F: 'new-taipei', C: 'keelung', H: 'taoyuan', J: 'hsinchu', O: 'hsinchu', K: 'miaoli',
	B: 'taichung', N: 'changhua', M: 'nantou', P: 'yunlin', Q: 'chiayi', I: 'chiayi', D: 'tainan',
	E: 'kaohsiung', T: 'pingtung', G: 'yilan', U: 'hualien', V: 'taitung',
};

// 簡化成手繪感的粗線條（設計稿的地圖也是簡化過的）
const simple = simplify(presimplify(topo), 2e-6);
const all = feature(simple, simple.objects.counties).features.filter((f) => COUNTIES[f.properties.COUNTYID]);

// 去掉本島以外的小島（綠島、蘭嶼、小琉球、龜山島、東沙…）：只留面積超過該縣市最大塊 5% 的多邊形
for (const f of all) {
	if (f.geometry.type !== 'MultiPolygon') continue;
	const areas = f.geometry.coordinates.map((c) => geoArea({ type: 'Polygon', coordinates: c }));
	const max = Math.max(...areas);
	f.geometry.coordinates = f.geometry.coordinates.filter((_, i) => areas[i] > max * 0.05);
}

const W = 245, H = 400;
const projection = geoMercator().fitSize([W, H], { type: 'FeatureCollection', features: all });
const path = geoPath(projection).digits(1);
const out = {};
for (const f of all) {
	const slug = COUNTIES[f.properties.COUNTYID];
	(out[slug] ??= []).push(path(f));
}
writeFileSync(new URL('../src/data/taiwan-map.json', import.meta.url),
	JSON.stringify({ viewBox: `0 0 ${W} ${H}`, paths: Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.join('')])) }) + '\n');
console.log(Object.keys(out).length, '個縣市');
