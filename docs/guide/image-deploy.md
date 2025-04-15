# Деплой через докер образ

Сделаем GitHub Actions workflow, который будет:

1. Собирать Docker-образ.
2. Пушить его в GitHub Container Registry (GHCR).
3. Заходить на целевой сервер по SSH.
4. Делать `docker pull` образа с GHCR.
5. Перезапускать `docker-compose`.

## Настройка GitHub Actions

Создаём файл `.github/workflows/main.yml` со следующим содержимым:

```yaml
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    outputs:
      image_id: ${{ steps.set-image.outputs.image_id }}

    steps:
      - name: Set image ID
        id: set-image
        run: echo "image_id=ghcr.io/${{ github.repository_owner }}/practice-flask" >> "$GITHUB_OUTPUT"

      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Log in to GitHub Container Registry
        run: echo "${{ secrets.GHCR_TOKEN }}" | docker login ghcr.io -u ${{ github.actor }} --password-stdin

      - name: Build Docker image
        run: |
          docker build -t ${{ steps.set-image.outputs.image_id }}:latest .

      - name: Push Docker image to GHCR
        run: |
          docker push ${{ steps.set-image.outputs.image_id }}:latest

  deploy:
    runs-on: ubuntu-latest

    needs: build

    steps:
      - name: SSH and deploy on server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ vars.SERVER_HOST }}
          username: ${{ vars.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            echo "${{ secrets.GHCR_TOKEN }}" | docker login ghcr.io -u ${{ github.actor }} --password-stdin
            IMAGE_ID=${{ needs.build.outputs.image_id }}
            docker pull $IMAGE_ID:latest
            cd ~/stacks/python
            docker compose down
            docker compose up -d
```

Секреты GitHub (в `Settings > Secrets and variables > Actions`):

- `SSH_PRIVATE_KEY ` — приватный SSH ключ (в формате OpenSSH)
- `GHCR_TOKEN` — [токен с правами на `write:packages` и `read:packages`](https://github.com/settings/tokens)

Переменные в GitHub (в `Settings > Secrets and variables > Actions`):

- `SERVER_HOST` — ip адрес сервера
- `SERVER_USER` — имя пользователя

## Docker-compose

На сервере соответственно по следующему пути должен быть файл `~/stacks/python/docker-compose.yml`

```yaml{3}
services:
  app:
    image: ghcr.io/tiangroup/practice-flask:latest
    hostname: python
    restart: unless-stopped
    ports:
      - 5000:5000
    environment:
      - TEST_VAR
```

## Доступ к образу без авторизации

Чтобы Docker-образ из GitHub Container Registry (GHCR) был доступен **без авторизации (публично)**, нужно изменить его видимость на **public**. Для этого нужно:

1. Найти нужный пакет на GitHub

- Переходим в `https://github.com/OWNER`, заменим `OWNER` на свой логин или организацию.
- Открываем вкладку **Packages**
- Выбираем нужный Docker-образ.

2. Изменить видимость образа

- Нажимаем **Package settings** (справа вверху).
- В разделе **Danger Zone** находим "Change visibility".
- Выбираем **Public**.
