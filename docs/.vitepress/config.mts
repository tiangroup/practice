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
      { text: "Материалы", link: "/materials" },
      { text: "Ссылки", link: "/links" },
    ],

    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],

    // socialLinks: [],

    lastUpdatedText: "Последнее обновление",
    outlineTitle: "На этой странице",
    docFooter: {
      prev: false,
      next: false,
    },
  },
});
