# Junior QA Testing Portfolio — VK Marusya

Учебное QA-портфолио на основе реального приложения [VK Marusya](https://github.com/Kolomiets94/VKMarusya). Это документация и тесты, а не заявление о коммерческом опыте или полном прохождении регресса.

## Проверяемая версия

Первоначальный commit: `2662d00144b4511ccf323cac46736642584df37b`. Повторная проверка: исправление `d5bcceede9dc9da31b5ebec0b8cd36776ff837f2`, слитое в main как `f206f2cbce7ef98de9dcf18cb67a21113ff174c6` (9 октября 2026).
React SPA с HashRouter, Redux Toolkit и сохранением избранного в localStorage.
По `src/api/shows.ts` каталог и поиск используют локальную редакционную подборку из восьми российских фильмов с ID 1000001–1000008. Для остальных ID карточка обращается к `https://api.tvmaze.com/shows/{id}`. Просмотр видео не реализован.

## Материалы

- [Тест-план](docs/test-plan.md)
- [20 тест-кейсов](docs/test-cases.md)
- [Чек-листы функциональности, адаптивности и доступности](docs/checklists.md)
- [Воспроизведённая ошибка установки](bugs/BUG-001-lockfile.md)
- [Шаблон баг-репорта](bugs/TEMPLATE.md)
- [Автоматизированные тесты](tests/catalog.test.cjs)
- [Первоначальная проверка](reports/verification.md)
- [Повторная проверка: 10 автотестов PASS](reports/retest-2026-10-09.md)

## Запуск приложения

```sh
git clone https://github.com/Kolomiets94/VKMarusya.git
cd VKMarusya
git checkout f206f2cbce7ef98de9dcf18cb67a21113ff174c6
npm ci
npm start
```

Первоначальная ошибка `npm ci` исправлена обновлением lock-файла: [BUG-001](bugs/BUG-001-lockfile.md). На указанной исправленной версии чистая установка, сборка и существующий Jest-тест прошли.

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

## Подтверждённые результаты
10 Playwright-сценариев прошли на локальной production-сборке в Chromium 153; [окружение и ограничения](reports/retest-2026-10-09.md). Это не полный регресс: ручные кейсы остаются NOT RUN, реальный TVmaze и GitHub Pages не проверены.
