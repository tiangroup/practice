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
          { text: "Инициализация Git", link: "/guide/git" },
          { text: "Установка VPS", link: "/guide/vps" },
          ...(process.env.NODE_ENV !== "production"
            ? [
                { text: "Стек сайта", link: "/guide/compose" },
                { text: "Nginx Proxy Manager", link: "/guide/npm" },
              ]
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
