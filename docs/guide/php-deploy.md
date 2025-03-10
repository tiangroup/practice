# Деплой сайта на PHP

Реализация CI/CD для проекта на GitHub выполняется с помощью GitHub Actions, который позволяет автоматически запускать тесты, сборку и деплой при каждом коммите.

## Настройка GitHub Actions

Для запуска CI/CD необходимо создать **workflow** файл в папке проекта `.github/workflows/`

Создаём в проекте файл `.github/workflows/main.yml` со следующим содержимым:

```yml
name: Deploy PHP Site

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  deploy:
    name: Deploy to Server
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Deploy via rsync
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan -H ${{ vars.SERVER_HOST }} >> ~/.ssh/known_hosts
          rsync -av --delete --exclude="uploads/" --exclude=".git/" --exclude=".github/" ./ ${{ vars.SERVER_USER }}@${{ vars.SERVER_HOST }}:~/stacks/mysite/html/
          rm -f ~/.ssh/id_rsa
```

Блок **on** указывает, при каких событиях должен запускаться workflow:

- **`push` в `main`** – workflow запустится только при пуше в ветку `main`
- **`pull_request` в `main`** – workflow запустится при создании или обновлении pull request в ветку `main`

## Генерация SSH-ключа

Для генерации SSH-ключа на сервере выполняем команду:

```sh
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f ~/.ssh/github_deploy
```

В результате должны получить:

- приватный ключ: `~/.ssh/github_deploy`
- публичный ключ: `~/.ssh/github_deploy.pub`

## Добавление публичного ключа на сервер

Копируем публичный ключ на сервере:

```sh
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

Это даст доступ к серверу по SSH без пароля.

## Добавление приватного ключа в GitHub Secrets

1. Открываем **GitHub → ваш репозиторий → Settings → Secrets and variables → Actions**.
2. Нажимаем `New repository secret`.
3. В поле **Name** указываем: `SSH_PRIVATE_KEY`.
4. Вставляем содержимое приватного ключа (`~/.ssh/github_deploy`), его можно получить выполнив на сервере:

```sh
cat ~/.ssh/github_deploy
```

5. Cохраняем

## Добавление переменных репозитория

1. Открываем **GitHub → ваш репозиторий → Settings → Secrets and variables → Actions**.
2. Выбираем вкладку **Variables**
3. Нажимаем **New repository variable**
4. В поле **Name** указываем: `SERVER_HOST`
5. В поле **Value** указываем ip нашего сервере
6. Нажимаем на **Add variable**
7. Еще раз нажимаем **New repository variable**
8. В поле **Name** указываем: `SERVER_USER`
9. В поле **Value** указываем имя нашего пользователя на сервере
10. Нажимаем на **Add variable**
