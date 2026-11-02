// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages 專案頁：https://lawrencelee0113.github.io/daoyou/
  // 改用自訂網域時：site 換成網域、base 刪掉，並在 public/ 加 CNAME
  site: 'https://lawrencelee0113.github.io',
  base: '/daoyou',
  // 開發時頁面底部的 Astro 工具列會擋住設計稿的底部，關掉
  devToolbar: { enabled: false },
  // 連結進到畫面就先預先下載那一頁，點下去換頁不用等網路（手機上最有感）
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  vite: {
    plugins: [tailwindcss()]
  }
});
