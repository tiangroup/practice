# Nginx Proxy Manager

Создаем папку приложения Nginx Proxy Manager:

```sh
mkdir -p  ~/stacks/nginx-proxy-manager
cd ~/stacks/nginx-proxy-manager
```

Создаём в этой папке файл `docker-compose.yml`:

```sh
nano docker-compose.yml
```

Вставляем в него следующее содержимое:

```yaml
services:
  npm:
    image: "jc21/nginx-proxy-manager:latest"
    restart: unless-stopped
    ports:
      - "80:80"
      - "81:81"
      - "443:443"
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
    networks:
      - web

networks:
  web:
    external: true
```

Нажимаем `CTRL+O` для сохранения и `CTRL+X` для выхода из редактора.

Если в докере не создана внешняя сеть `web`, создаём её:

```sh
docker network create web
```

Запускаем приложение:

```sh
docker compose up -d
```

После запуска приложение доступно по адресу `http://ip:81`

Администратор по умолчанию для первоначального входа:

```
Email:    admin@example.com
Password: changeme
```
