import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/practice/",
  lang: "ru-RU",
  title: "Практика",
  description: "Практика",
  locales: {
    root: {
      label: "Русский",
      lang: "ru",
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // { text: 'Home', link: '/' },
      { text: "Руководство", link: "/guide/git", activeMatch: "/guide/" },
      { text: "Ссылки", link: "/links" },
    ],

    sidebar: [
      {
        text: "Руководство",
        items: [
          { text: "Git", link: "/guide/git" },
          // { text: "VPS", link: "/guide/vps" },
          ...(process.env.NODE_ENV !== "production"
            ? [{ text: "VPS", link: "/guide/vps" }]
            : []),
        ],
      },
    ],

    // socialLinks: [],

    lastUpdatedText: "Последнее обновление",
    outlineTitle: "Содержание страницы",
    docFooter: {
      prev: false,
      next: false,
    },
  },
});
