# Фактическая проверка — 2026-10-09

## Объект и окружение
VKMarusya commit `2662d00144b4511ccf323cac46736642584df37b`; Linux; Node.js v24.19.0; npm 11.9.0; установленная библиотека Playwright 1.62.1.

## Выполнено
| Проверка | Результат | Доказательство |
| --- | --- | --- |
| Чтение каталога, API, страниц и favorites reducer | Выполнено, это анализ кода | src/api/shows.ts, src/pages/{HomePage,MoviePage}.tsx, src/store/favoritesSlice.ts |
| npm ci --no-audit --no-fund в свежем clone приложения | FAIL | Код 1, EUSAGE; BUG-001 |
| node --check tests/catalog.test.cjs | PASS | Код 0; подтверждает только синтаксис |
| npm test портфолио | BLOCKED | Browser launch hook: Chromium executable doesn't exist |
| Загрузка Chromium через Playwright CLI | BLOCKED | ZIP download invalid/truncated; End of central directory record signature not found |

## Что не подтверждено
20 ручных кейсов не выполнялись. 10 автоматизированных сценариев подготовлены, но проверка интерфейса не началась из-за ошибки browser launch hook. Это ограничение окружения, не 10 дефектов приложения и не PASS. Не подтверждены работа GitHub Pages, обход установки через npm install, Firefox/WebKit, клавиатура, screen reader, контраст и мобильная матрица.

Из найденных дефектов публикуется только ошибка чистой установки BUG-001. Анализ кода и подготовка сценариев не доказывают работоспособность продукта. После доступного запуска необходимо сохранить дату, URL, commit, browser version и фактический результат каждого кейса в новом отчёте.
