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
  head: [
    [
      "link",
      { rel: "icon", type: "image/png", href: "/practice/favicon-x2.png" },
    ],
  ],
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
          { text: "Стек сайта на PHP", link: "/guide/compose" },
          { text: "Nginx Proxy Manager", link: "/guide/npm" },
          {
            text: "CI/CD",
            items: [
              { text: "Деплой сайта на PHP", link: "/guide/php-deploy" },
              {
                text: "Деплой сервиса на Python",
                link: "/guide/python-deploy",
              },
            ],
          },
          ...(process.env.NODE_ENV !== "production"
            ? [
                {
                  text: "Приложения",
                  items: [
                    {
                      text: "Менеджер паролей Vaultwarden",
                      link: "/guide/vaultwarden",
                    },
                  ],
                },
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
