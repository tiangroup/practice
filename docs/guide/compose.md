# Стек сайта

Создаем папку для докер стеков:

```sh
mkdir ~/stacks
cd stacks
```

Создаем папку стека для нашего сайта:

```sh
mkdir mysite
cd mysite
```

Создаём внутри папку для файлов сайта:

```sh
mkdir html
```

Создаём файл `docker-compose.yml`:

```sh
nano docker-compose.yml
```

Вставляем в него следующее содержимое:

```yaml
services:
  mysql:
    image: mysql:8.0
    restart: always
    volumes:
      - ./db_data:/var/lib/mysql
    environment:
      - MYSQL_DATABASE=${MYSQL_DATABASE:-www_site}
      - MYSQL_USER=${MYSQL_USER:-www_site}
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
    command: mysqld --sql-mode="" --innodb_use_native_aio=0
    networks:
      - host

  pma:
    image: phpmyadmin/phpmyadmin:latest
    restart: always
    depends_on:
      - mysql
    ports:
      - 8080:80
    environment:
      - PMA_HOST=mysql
      - UPLOAD_LIMIT="150M"
    networks:
      - web
      - host

  php:
    image: php:8.3-apache
    restart: always
    ports:
      - 8080:80
    volumes:
      - ./html:/var/www/html
    networks:
      - web
      - host

networks:
  host:
  web:
    external: true
```

Нажимаем `CTRL+O` для сохранения и `CTRL+X` для выхода из редактора.

Создаем файл `.env` для задания переменных окружения

```sh
nano .env
```

Вставляем в него следующее содержимое со своими паролями и названиями:

```
MYSQL_ROOT_PASSWORD=3lIbTIFF68YIoK
MYSQL_USER=mysite
MYSQL_PASSWORD=Ovmj1yvFil6QEl
MYSQL_DATABASE=mysite
```

Нажимаем `CTRL+O` для сохранения и `CTRL+X` для выхода из редактора.

Нужно в докере создать внешнюю сеть `web`:

```sh
docker network create web
```

Запускаем стек сайта:

```sh
docker compose up -d
```

Можно проверить работу наших сервисов, для этого открываем в браузере для своего ip адреса `http://178.248.37.68:8080` для сайта и `http://178.248.37.68:8081` для phpMyAdmin.
