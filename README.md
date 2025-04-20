# Проектная работа "Веб-ларек"

## Назначение

Веб-приложение для демонстрации каталога товаров, добавления их в корзину и оформления заказа. Приложение построено по архитектуре **Model-View-Presenter (MVP)**, обеспечивая разделение ответственности, высокую модульность и удобную масштабируемость.

---

## Используемый стек

- **Язык:** TypeScript
- **Стили:** SCSS
- **Сборка:** Webpack
- **Разметка:** HTML

---

## Инструкция по сборке и запуску

Установите зависимости и запустите проект:

```bash
npm install
npm run start
```

Для сборки:

```bash
npm run build
```

---

## Архитектура проекта

### Основные элементы MVP

- **Model** – отвечает за бизнес-логику и управление данными (например, корзина и оформление заказа).
- **View** – визуальные компоненты, не содержащие логики. Получают данные через presenter.
- **Presenter** – координирует логику приложения, реагирует на пользовательские действия, обновляет модель и представление.

### Структура проекта

```
src/
├── api/                // Взаимодействие с сервером
├── components/         // Компоненты UI и логики
├── common.blocks/      // SCSS-стили
└── index.ts            // Точка входа (Presenter)
```

---

## Компоненты и их функции

### 🧠 `AppState.ts` – состояние приложения

Класс `AppState` реализует хранение состояния приложения и связывает части приложения через шину событий

**Поля:**

- `eventEmitter: EventEmitter` — эмиттер собтий
- `productList: IProductItem[]` — список всех продуктов
- `currentProduct: IProductItem | null` — текущий выбранный продукт
- `order: OrderModel` — модель с заказом
- `lastOrderTotal: number` — сумма последнего заказа

**Методы:**

- `addToCart(item: IProductItem): void` — добавить товар в заказ
- `removeFromCart(item: IProductItem): void` — удалить товар из заказа
- `setCurrentProduct(product: IProductItem | null): void` — установить текущий выбранный продукт
- `isInCart(product: IProductItem): boolean` — проверить наличие товара в заказе
- `openBasket(): void` — открыть корзину
- `openOrderForm(): void` — открыть форму заказа
- `openContactsForm(): void` — открыть форму контактов
- `openSuccess(): void` — открыть окно успеха
- `closeSuccess(): void` — закрыть окно успеха
- `submitOrder(): void` — отправить заказ
- `fetchData(): void` — загрузить данные о товарах

---

### 🧠 `OrderModel.ts` – модель заказа

Класс `OrderModel` реализует хранение текущего заказа и его ошибок, а также его валидацию, отправку на сервер.

**Поля:**

- `value` — текущее значение
- `eventEmitter` — эмиттер событий модели
- `errors` — массив ошибок

**Методы:**

- `reset()` — метод сброса модели до дефолтного значения
- `resetErors()` — метод сброса ошибок
- `setValue(value: Order)` — заменяет значение всей модели на новое
- `updateField<K extends keyof Order>(field: K, value: Order[K])` — обновляет конкретное поле модели
- `validateOrder(): boolean` — валидирует данные для формы заказа
- `validateContacts(): boolean` — валидирует данные для формы контактов
- `submit()` — отправляет данные на сервер
- `asJson(): IOrderPayload` — переводит данные к формату API
- `updateTotal()` — обновляет сумму заказа

---

### 🌐 `getProducts.ts` – загрузка товаров

- Получает список товаров с сервера (`GET-запрос`).
- Возвращает `Promise<Product[]>`.

➡️ Используется в `AppStore.ts` при инициализации.

---

### 📦 `submitOrder.ts` – отправка заказа

- Отправляет `POST-запрос` с объектом заказа (`Order`).
- Возвращает результат (`OrderResult`).

➡️ Используется в `OrderModel.ts` при оформлении заказа.

---

### 🎛 `index.ts` – координатор (Presenter)

- Инициализирует AppStore
- Инициализирует компоненты

➡️ Является центром логики приложения.

---

## View-компоненты (представление)

Компоненты реализованы через классы, каждый из которых отвечает за отображение и взаимодействие с определённой частью интерфейса. Визуальная часть стилизуется с помощью SCSS в папке `common.blocks`.

### Component

Базовый абстрактный класс компонентов.

- Хранит привязанный DOM-элемент
- Имеет доступ к состоянию приложения

Некоторые компоненты имеют метод update(), вызываемый при различных событиях и обновляюзий содержимое DOM-элемента

### Список компонентов:

- `BasketComponent` — компонент корзины
- `ContactsFormComponent` — компонент формы контактов
- `ModalComponent` — компонент модального окна
- `OrderFormComponent` — компонент формы заказов
- `PageComponent` — компонент страницы приложения
- `ProductBasketCard` — компонент карточки товара для корзины
- `ProductCard` — базовый компонент для карточек товаров из превью и каталога
- `ProductCatalogCard` — компонент карточки товара для каталога
- `ProductGallery` — компонент каталога
- `ProductPreviewCard` — компонент карточки товара для превью
- `SuccessComponent` — компонент уведомления об успехе

---

## Модели данных

```ts
export interface IAppState {
  eventEmitter: EventEmitter
  productList: IProductItem[]
  currentProduct: IProductItem | null
  order: OrderModel
  lastOrderTotal: number
  addToCart(item: IProductItem): void
  removeFromCart(item: IProductItem): void
  setCurrentProduct(product: IProductItem | null): void
  isInCart(product: IProductItem): boolean
  openBasket(): void
  openOrderForm(): void
  openContactsForm(): void
  openSuccess(): void
  closeSuccess(): void
  submitOrder(): void
  fetchData(): void
}

// обертка над ответом сервера при запросе списков
export type IListResponse<T> = {
  total: number
  items: T[]
}

// модель заказа
export type IOrderModel = {
  payment: string
  address: string
  email: string
  phone: string
  items: IProductItem[]
  total: number
}

// интерфейс заказа, соответствующий API
export interface IOrderPayload {
  payment: string
  address: string
  email: string
  phone: string
  items: string[]
  total: number
}

// ответ при создании заказа
export interface IOrderResponse {
  id: string
  total: number
}

// продукт
export interface IProductItem {
  id: string
  description: string
  image: string
  title: string
  category: ProductItemCategory
  price: number
}
```

---

## Сценарии взаимодействия

### ➕ Добавление товара в корзину

1. Пользователь нажимает "Купить".
2. `Presenter` вызывает `AppState.addToCart`.
3. `AppState` обновляет данные модели `OrderModel`.
4. `OrderModel` обновляется и вызывает `emit('updated')`
5. Подписанные UI-компоненты получают обновления.

### 🛒 Оформление заказа

1. Пользователь заполняет форму.
2. `AppState` обновляет `OrderModel` и вызывает `submitOrder()`.
3. `OrderModel` отправляет данные на сервер.
4. После ответа сервера — отображение модального окна с результатом.
5. В случае ошибки — ввывод текста ошибки в форму

---

