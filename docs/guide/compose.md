# Стек сайта на PHP

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
      - 8081:80
    environment:
      - PMA_HOST=mysql
      - UPLOAD_LIMIT="150M"
    networks:
      - web
      - host

  php:
    image: tiangroup/php:8.3
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

Добавим файл на сайт:

```sh
nano html/index.php
```

Вставим следующее содержимое:

```php
<?php
$servername = "mysql";
$username = "mysite";
$password = "Ovmj1yvFil6QEl";
$database = "mysite";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Ошибка подключения: " . $conn->connect_error);
}

$sql = "SELECT name FROM goods";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "<ul>";
    while ($row = $result->fetch_assoc()) {
        echo "<li>" . htmlspecialchars($row["name"]) . "</li>";
    }
    echo "</ul>";
} else {
    echo "Нет данных";
}

$conn->close();
?>

```

Нажимаем `CTRL+O` для сохранения и `CTRL+X` для выхода из редактора.

Остановить работу стека сайта можно следующей командой:

```sh
docker compose down
```
