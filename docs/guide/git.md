# Git

#### 1. Создаём репозиторий на GitHub/GitLab

- Переходим на [GitHub](https://github.com/), [GitLab](https://gitlab.com/)
- Создаём новый репозиторий.
- Копируем его URL (например, `https://github.com/user/repo.git`).

#### 2. Инициализируем локальный репозиторий

```sh
cd /путь/к/проекту
git init
```

#### 3. Добавляем файлы и создаём коммит

```sh
git add .
git commit -m "Initial commit"
```

#### 4. Добавляем удалённый репозиторий, котрый мы создали

```sh
git remote add origin https://github.com/user/repo.git
```

#### 5. Отправляем код в удалённый репозиторий

```sh
git branch -M main
git push -u origin main
```
