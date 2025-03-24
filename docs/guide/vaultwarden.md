# Менеджер паролей Vaultwarden

[Vaultwarden](https://github.com/dani-garcia/vaultwarden) — это легковесная альтернатива официальному серверу Bitwarden, совместимая с его клиентами.

## Установка Vaultwarden

Создаём рабочую папку для `Vaultwarden`:

```sh
mkdir -p ~/stacks/vaultwarden
cd ~/stacks/vaultwarden
```

Создаём файл `docker-compose.yml`:

```sh
nano docker-compose.yml
```

Заполняем его следующим содержимым:

```yaml
services:
  vaultwarden:
    image: vaultwarden/server:latest-alpine
    container_name: vaultwarden
    restart: unless-stopped
    volumes:
      - ./vw-data/:/data/
    networks:
      - backend
    environment:
      - SIGNUPS_ALLOWED=true

  cloudflared:
    image: cloudflare/cloudflared:latest
    restart: unless-stopped
    command: tunnel --no-autoupdate run --token $CF_TUNNELL_KEY
    networks:
      - backend

networks:
  backend: {}
```

Получим ключ `$CF_TUNNELL_KEY` для туннеля cloudflare. Для этого заходим в свой профиль на [Cloudflare](https://www.cloudflare.com/), переходим в раздел `Zero Trust` -> `Networks` -> `Tunnels` и создаём туннель `+ Create a tunnel`. Выбираем тип туннеля `Cloudflared`. Далее вписываем в поле `Tunnel name` имя туннеля, например `vaultwarden`, жмём далее `Next`, и в появившемся окне копируем любую команду, например:

```sh
cloudflared.exe service install eyJhIjoiNTFlMTYzMjIxNTkyMGZjYmM4ZTc0ZDJjYjY1YTk5ZjciLCJ0IjoiZGY5NTk1ZTrtYTU3My00ZGQzLWIwYTgtYTYzMjRhZjkwNWQ5IiwicyI6IlpUWmpNMk0xWXpFdFpUTmhNaTAwT0dZeExXSXhNr1l0T1dFM1pUQTVZemRpTWpoayJ9
```

Из которой извлекаем токен туннеля:

```
eyJhIjoiNTFlMTYzMjIxNTkyMGZjYmM4ZTc0ZDJjYjY1YTk5ZjciLCJ0IjoiZGY5NTk1ZTrtYTU3My00ZGQzLWIwYTgtYTYzMjRhZjkwNWQ5IiwicyI6IlpUWmpNMk0xWXpFdFpUTmhNaTAwT0dZeExXSXhNr1l0T1dFM1pUQTVZemRpTWpoayJ9
```

Жмём далее `Next` и в следующем окне вписываем следующие данные для `hostname`:

- `Subdomain`: vw
- `Domain`: выбираем свой домен
- `Type`: HTTP
- `URL`: vaultwarden:80

Сохраняем туннель `Save`.

Теперь на сервере в папке стека создаем файл `.env`:

```sh
nano .env
```

и вставляем в него получившийся токен:

```
CF_TUNNELL_KEY=eyJhIjoiNTFlMTYzMjIxNTkyMGZjYmM4ZTc0ZDJjYjY1YTk5ZjciLCJ0IjoiZGY5NTk1ZTrtYTU3My00ZGQzLWIwYTgtYTYzMjRhZjkwNWQ5IiwicyI6IlpUWmpNMk0xWXpFdFpUTmhNaTAwT0dZeExXSXhNr1l0T1dFM1pUQTVZemRpTWpoayJ9
```

Запускаем контейнеры:

```sh
docker compose up -d
```

Теперь можно перейти по созданному доменному имени туннеля `vw.мой-домен.ru`.

Для первоначальной регистрации нужно зайти на адрес `https://vw.мой-домен.ru/#/register`.

После регистрации можно отключить режим регистрации пользователей, для этого нужно в файле `docker-compose.yml` установить переменную окружения в `SIGNUPS_ALLOWED=false`, и перезапустить контейнеры:

```sh
docker compose down && docker compose up -d
```

## Резервное копирование

Установим [Rclone](https://rclone.org/)

```sh
curl https://rclone.org/install.sh | sudo bash
```

Создадим конфигурация для копирование в облачный сервис:

```sh
rclone config
```

```
No remotes found, make a new one?
n) New remote
s) Set configuration password
q) Quit config
n/s/q>

```

выбираем создать новую, вводим `n` и жмем `Enter`.

```
Enter name for new remote.
name>
```

вводим имя, например `vwb, жмем `Enter`.

```
Storage> 32
```

Выбираем из списка номер хранилища (в данном случае: 32 - mailru). Далее в диалоге необходимо буде указать почтовый адрес на mail.ru для user и созданный пароль для внешних приложений (указать все права для него). Сохраняем конфигурацию и выходим.

Проверить созданную конфигурацию можно командой.

```sh
rclone lsd vwb:
```

Теперь в папке стека создадим файл:

```sh
nano backup.sh
```

со следующим содержимым:

```bash
#!/bin/bash

# Параметры
TARGET_DIR="/home/username/stacks/vaultwarden"
ARCHIVE_NAME="vaultwarden_stack.tar.gz"
BACKUP_DIR="/home/username/stacks/backups"
RCLONE_REMOTE="vwb:backups"

# Проверка существования папки
if [ ! -d "$TARGET_DIR" ]; then
    echo "Папка $TARGET_DIR не существует. Скрипт завершён."
    exit 1
fi

# Остановка Docker Compose
echo "Останавливаю Docker Compose..."
cd "$TARGET_DIR" || exit
docker compose stop
if [ $? -ne 0 ]; then
    echo "Ошибка при остановке Docker Compose. Скрипт завершён."
    exit 1
fi

# Создание папки для бэкапов, если её нет
mkdir -p "$BACKUP_DIR"

# Архивирование папки
echo "Архивирую папку $TARGET_DIR..."
tar -cpzf "$BACKUP_DIR/$ARCHIVE_NAME" -C "$TARGET_DIR" .
if [ $? -ne 0 ]; then
    echo "Ошибка при создании архива. Скрипт завершён."
    exit 1
fi

echo "Архив создан: $BACKUP_DIR/$ARCHIVE_NAME"

# Запуск Docker Compose
echo "Запускаю Docker Compose..."
docker compose start
if [ $? -ne 0 ]; then
    echo "Ошибка при запуске Docker Compose. Проверьте настройки вручную."
    exit 1
fi

# Синхронизация архива на Google Drive через rclone
echo "Синхронизирую архив..."
rclone sync "$BACKUP_DIR/$ARCHIVE_NAME" "$RCLONE_REMOTE"
if [ $? -ne 0 ]; then
    echo "Ошибка при синхронизации архива. Скрипт завершён."
    exit 1
fi

# Удаление папки для бэкапов
rm -r "$BACKUP_DIR"

echo "Архив успешно синхронизирован"

# Успешное завершение
exit 0
```

Нажимаем `CTRL+O` для сохранения и `CTRL+X` для выхода из редактора.

Делаем скрипт исполняемым:

```sh
chmod +x backup.sh
```

Добавляем задание на архивирование в **Cron**

```sh
crontab -e
```

Вставляем строчку для исполнения каждые 4 минуты

```
*/4 * * * * /home/pav/stacks/vaultwarden/backup.sh > /dev/null 2>&1
```

## Ссылки

- [Vaultwarden](https://github.com/dani-garcia/vaultwarden)
- [Vaultwarden backup](https://github.com/ttionya/vaultwarden-backup)
