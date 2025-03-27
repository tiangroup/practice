# Деплой на Netlify

**[Netlify](https://www.netlify.com/)** — это облачная платформа для развертывания, управления и хостинга статических сайтов и веб-приложений. Она автоматизирует процесс сборки и публикации, интегрируется с системами контроля версий (например, GitHub, GitLab, Bitbucket) и обеспечивает такие функции, как непрерывное развертывание, управление доменами, автоматический HTTPS, серверные функции без настройки бэкенда (serverless) и глобальное кэширование через CDN.

## Установка VitePress

> [!NOTE] VitePress
> **[VitePress](https://vitepress.dev/ru/)** — это лёгкий и быстрый статический генератор сайтов. Он предназначен для создания документации, блогов и простых контентных сайтов. Благодаря использованию Vite, VitePress обеспечивает мгновенную горячую перезагрузку, быструю сборку.

Создаём в исходной папке новый проект с помощью команды:

```sh
npx vitepress init
```

Отвечаем на вопросы мастера

```
┌  Welcome to VitePress!
│
◇  Where should VitePress initialize the config?
│  ./docs
│
◇  Where should VitePress look for your markdown files?
│  ./docs
│
◇  Site title:
│  Мой проект
│
◇  Site description:
│  Сайт на VitePress
│
◇  Theme:
│  Default Theme
│
◇  Use TypeScript for config and theme files?
│  Yes
│
◇  Add VitePress npm scripts to package.json?
│  Yes
│
◇  Add a prefix for VitePress npm scripts?
│  Yes
│
◇  Prefix for VitePress npm scripts:
│  docs
│
└  Done! Now run pnpm run docs:dev and start writing.
```

Ставим `vitepress`

```sh
npm add -D vitepress
```

Устанавливаем зависимости:

```sh
npm install
```

Запускаем локальный сервер:

```sh
npm run docs:dev
```

Создаем файл `.gitignore` и записываем в него

```
node_modules
```

Создаём репозиторий, добавляем файлы в Git и загружаем их на GitHub:

```sh
git init
git add .
git commit -m "init"
git branch -M main
git remote add origin https://github.com/your-username/vitepress-site.git
git push -u origin main
```

## Деплой на Netlify

Переходим на [Netlify](https://www.netlify.com/) и регистрируемся, лучше всего с помощью GitHub.

Выбираем `Import fom Git` , деплоим из GitHub, выбираем нужный репозиторий, при необходимости конфигурируем Netlify приложение в GitHub (Configure the Netlify app on GitHub).

Заполняем поля следующим образом:

- **Build command**: `npm run docs:build`
- **Publish directory** : `docs/.vitepress/dist`

Нажимаем `Deploy` и ждём завершения развертывания.

## Привязка своего домена

В панели Netlify выбираем нужный сайт, переходим в раздел **Domain management** и добавляем свой домен или поддомен, нажав **Add domain**. Вводим имя домена или поддомена и нажимаем **Verify**.

Затем добавляем в свой **DNS** запись типа `TXT` с предложенными `Host` и `Value`. После успешной верификации домена в Netlify создаём в DNS запись типа `CNAME`, указывая в качестве значения поддомен сайта на Netlify, например: `delightful-entremet-6700d7.netlify.app`.

Чтобы включить HTTPS, нажимаем **Verify DNS configuration**, а после успешной проверки — **Provision certificate** для выпуска и активации сертификата.
