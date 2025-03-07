# Инициализация Git

Создаём репозиторий на GitHub/GitLab, для этого:

- Переходим на [GitHub](https://github.com/), [GitLab](https://gitlab.com/)
- Создаём новый репозиторий.
- Копируем его URL (например, `https://github.com/user/repo.git`).

Инициализируем локальный репозиторий:

```sh
cd /путь/к/проекту
git init
```

Добавляем файлы и создаём коммит

```sh
git add .
git commit -m "Initial commit"
```

Добавляем удалённый репозиторий, котрый мы создали

```sh
git remote add origin https://github.com/user/repo.git
```

Отправляем код в удалённый репозиторий

```sh
git branch -M main
git push -u origin main
```
