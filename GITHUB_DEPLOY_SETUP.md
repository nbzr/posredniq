# Настройка автоматического деплоя через GitHub

## Шаг 1: Создай SSH ключ для GitHub Actions

На своей машине выполни:

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_deploy
```

Нажми Enter (без пароля).

Это создаст 2 файла:
- `~/.ssh/github_deploy` - приватный ключ (для GitHub)
- `~/.ssh/github_deploy.pub` - публичный ключ (для сервера)

## Шаг 2: Добавь публичный ключ на сервер

```bash
# Скопируй публичный ключ
cat ~/.ssh/github_deploy.pub

# Добавь на сервер
ssh root@212.193.26.224 "mkdir -p ~/.ssh && echo 'вставь_сюда_публичный_ключ' >> ~/.ssh/authorized_keys"
```

## Шаг 3: Добавь секреты в GitHub

1. Зайди в свой репозиторий на GitHub
2. Settings → Secrets and variables → Actions
3. Нажми **"New repository secret"**

Добавь 3 секрета:

### SERVER_HOST
```
212.193.26.224
```

### SERVER_USER
```
root
```

### SSH_PRIVATE_KEY
```bash
# Скопируй приватный ключ полностью:
cat ~/.ssh/github_deploy

# Вставь весь вывод (включая -----BEGIN и -----END)
```

## Шаг 4: Отправь код в GitHub

```bash
cd /Users/fedorgetmanov/myapps/MassEffect

# Инициализируй git (если еще не сделал)
git init

# Добавь все файлы
git add .

# Первый коммит
git commit -m "Initial commit with auto-deploy"

# Добавь remote (создай репозиторий на GitHub сначала)
git remote add origin https://github.com/твой-username/MassEffect.git

# Отправь на GitHub
git push -u origin main
```

## Как это работает

После каждого `git push`:

1. GitHub Actions запускается автоматически
2. Собирает приложение (`npm run build`)
3. Загружает на сервер через SSH
4. Перезапускает nginx

## Ручной запуск деплоя

В GitHub:
1. Actions → Deploy to Server
2. Run workflow → Run workflow

## Проверка

После push:
1. Зайди в GitHub → Actions
2. Увидишь статус деплоя
3. Через ~2 минуты изменения будут на https://posredniq.duckdns.org

## Быстрая команда для обновления

```bash
cd /Users/fedorgetmanov/myapps/MassEffect
git add .
git commit -m "Update: описание изменений"
git push
```

И всё! GitHub автоматически задеплоит.

## Troubleshooting

### SSH ключ не работает
Проверь права на сервере:
```bash
ssh root@212.193.26.224 "chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"
```

### Deploy failed
Проверь логи в GitHub Actions и убедись что все 3 секрета добавлены.

### Файлы не обновляются
Очисти кэш браузера (Ctrl+Shift+R) или проверь файлы на сервере:
```bash
ssh root@212.193.26.224 "ls -lh /var/www/commerce/"
```
