# Junior QA Testing Portfolio — VK Marusya

Учебное QA-портфолио на основе реального приложения [VK Marusya](https://github.com/Kolomiets94/VKMarusya). Это документация и тесты, а не заявление о коммерческом опыте или полном прохождении регресса.

## Проверяемая версия

Исходный commit: `2662d00144b4511ccf323cac46736642584df37b` (проверен 9 октября 2026).
React SPA с HashRouter, Redux Toolkit и сохранением избранного в localStorage.
По `src/api/shows.ts` каталог и поиск используют локальную редакционную подборку из восьми российских фильмов с ID 1000001–1000008. Для остальных ID карточка обращается к `https://api.tvmaze.com/shows/{id}`. Просмотр видео не реализован.

## Материалы

- [Тест-план](docs/test-plan.md)
- [20 тест-кейсов](docs/test-cases.md)
- [Чек-листы функциональности, адаптивности и доступности](docs/checklists.md)
- [Воспроизведённая ошибка установки](bugs/BUG-001-lockfile.md)
- [Шаблон баг-репорта](bugs/TEMPLATE.md)
- [Автоматизированные тесты](tests/catalog.test.cjs)
- [Фактическая проверка и ограничения](reports/verification.md)

## Запуск приложения

```sh
git clone https://github.com/Kolomiets94/VKMarusya.git
cd VKMarusya
git checkout 2662d00144b4511ccf323cac46736642584df37b
npm ci
npm start
```

На этой версии `npm ci` воспроизводимо падает: [BUG-001](bugs/BUG-001-lockfile.md). Для отдельной локальной тестовой копии можно выполнить `npm install --no-audit --no-fund`, затем `npm start`. Эта команда обновляет локальный lock-файл; не коммитьте его без отдельного исправления. Успешность этого обходного пути здесь не подтверждена.

## Запуск тестов

Требуется Node.js 20+ и доступ к npm и загрузке Chromium. В папке этого портфолио:

```sh
npm install
npx playwright install chromium
npm test
```

Приложение должно работать отдельно на `http://localhost:3000`. Другой адрес:

```sh
BASE_URL=https://kolomiets94.github.io/VKMarusya npm test
```

PowerShell:

```powershell
$env:BASE_URL = "http://localhost:3000"
npm test
```

Тесты используют Playwright с встроенным `node:test`: изолированный контекст на каждый сценарий, без аккаунтов и реальных писем. Два API-сценария перехватывают запросы и возвращают fixtures; они не проверяют доступность TVmaze. Опубликованная версия может отличаться от указанного commit, поэтому результат против Pages нельзя считать проверкой исходного commit без сравнения версии.

Статусы подготовленных кейсов и фактических запусков указаны в отчёте. Баги интерфейса без воспроизведения не публикуются.
