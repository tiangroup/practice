# Деплой сервиса на Python

## Установка на сервер

Создаём на сервере папку стека сервиса:

```sh
mkdir -p ~/stacks/python
cd ~/stacks/python
```

Внутри создаем папку для файлов приложения:

```sh
mkdir app
```

Создаём файл `docker-compose.yml`

```sh
nano docker-compose.yml
```

Вставляем в него следующее содержимое:

```yaml
services:
  app:
    build: app
    hostname: python # изменяет сетевое имя контейнера
    restart: always
    ports:
      - 5000:5000
    networks:
      - web

networks:
  web:
    external: true
```

Нажимаем `CTRL+O` для сохранения и `CTRL+X` для выхода из редактора.

Если не создана внешняя сеть `web` создаём:

```sh
docker network create web
```

## Создание Dockerfile

В корне проекта создаем файл с именем `Dockerfile` и заполняем следующим содержимым:

```
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
build-essential \
python3-dev \
&& rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["uwsgi", "--http", "0.0.0.0:5000", "--module", "app:app"]
```

Также желательно в корне проекта сделать файл `.dockerignore` с содержимым:

```
.dockerignore
.git
.gitignore
Dockerfile
```

## Настройка GitHub Actions

Создаём в проекте файл `.github/workflows/main.yml` со следующим содержимым:

```yaml
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

      - name: Copy via rsync
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan -H ${{ vars.SERVER_HOST }} >> ~/.ssh/known_hosts
          rsync -av --delete --exclude=".env" --exclude=".git/" --exclude=".github/" ./ ${{ vars.SERVER_USER }}@${{ vars.SERVER_HOST }}:~/stacks/python/app/

      - name: Docker build
        uses: appleboy/ssh-action@master
        with:
          host: ${{ vars.SERVER_HOST }}
          username: ${{ vars.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd ~/stacks/python
            docker compose up --build -d
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

## Проект

[https://github.com/tiangroup/practice-flask](https://github.com/tiangroup/practice-flask)
