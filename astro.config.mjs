// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // 自訂網域（GitHub repo → Settings → Pages 設定），網站掛在根目錄。
  // 用 Actions 部署，網域以 Pages 設定為準，不需要 public/CNAME
  site: 'https://isleposts.com',
  // 開發時頁面底部的 Astro 工具列會擋住設計稿的底部，關掉
  devToolbar: { enabled: false },
  // 連結進到畫面就先預先下載那一頁，點下去換頁不用等網路（手機上最有感）
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  vite: {
    plugins: [tailwindcss()]
  }
});
