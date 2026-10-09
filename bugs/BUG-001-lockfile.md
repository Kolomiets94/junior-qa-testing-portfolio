# BUG-001 — Чистая установка npm ci невозможна

- Статус: FIXED, воспроизведён и повторно проверен 2026-10-09.
- Объект: VKMarusya commit `2662d00144b4511ccf323cac46736642584df37b`.
- Тип: сборка/воспроизводимость установки. Severity: Major; предлагаемый приоритет P1.
- Среда: Linux, npm 11.9.0, свежий git clone, команда npm ci --no-audit --no-fund.

## Шаги
1. Клонировать https://github.com/Kolomiets94/VKMarusya.git.
2. Переключиться на указанный commit.
3. В корне выполнить npm ci --no-audit --no-fund.

## Ожидается
Установка зависимостей по committed package-lock.json заканчивается с кодом 0.

## Фактически
Код завершения 1 (EUSAGE): package.json и package-lock.json не синхронизированы. Без установки приложение не удаётся запустить обычным путём npm ci.

## Доказательство (выдержка фактического вывода)
```text
npm error code EUSAGE
npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync.
npm error Missing: @reduxjs/toolkit@2.13.0 from lock file
npm error Missing: axios@1.20.0 from lock file
npm error Missing: react-redux@9.3.0 from lock file
npm error Missing: react-router-dom@6.30.6 from lock file
```
Разрешённые версии могут измениться при повторе из-за диапазонов package.json. Существенный факт — рассинхронизация lock-файла, а не конкретный номер последней версии.

## Предлагаемое исправление
В отдельной ветке приложения согласовать зависимости и обновить lock-файл, затем подтвердить свежим npm ci и сборкой. В этом PR исходники приложения не меняются. Обход через npm install не проверен и не считается исправлением.

## Повторная проверка
Исправлен в [VKMarusya PR №1](https://github.com/Kolomiets94/VKMarusya/pull/1): обновлён package-lock.json. Чистая установка npm ci, сборка и Jest-тест проходят; [полный отчёт](../reports/retest-2026-10-09.md). Исходные шаги и вывод выше сохранены для истории.
