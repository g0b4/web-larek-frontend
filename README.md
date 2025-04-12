# 🛒 Web-ларёк — интернет-магазин для веб-разработчиков

## 📌 Описание проекта

Web-ларёк — это одностраничное приложение, реализующее интернет-магазин с каталогом товаров, корзиной и формой оформления заказа. Приложение построено по архитектуре **MVP (Model-View-Presenter)**. Все данные получаются с внешнего API.

---

## 🧰 Используемый стек

- HTML/CSS (готовая вёрстка)
- TypeScript
- Parcel (сборка)
- REST API (https://larek-api.nomoreparties.co)
- EventEmitter (встроенный брокер событий)
- PlantUML (схема классов)

---

## ▶️ Инструкция по запуску

1. Установите зависимости:

```bash
npm install
```


2. Создайте .env в корне проекта:
```ini
API_ORIGIN=https://larek-api.nomoreparties.co
```


3. Запустите проект:
```bash
npm run start
```


## 🧱 Структура проекта

src/
├── api/               → ApiClient.ts
├── models/            → ProductModel, CartModel, OrderModel
├── views/             → CatalogView, CartView, CheckoutView, ModalView
├── presenter/         → AppPresenter.ts
├── types/             → Интерфейсы и типы (product.ts, cart.ts, order.ts, ...)
├── utils/             → EventEmitter.ts, formatPrice.ts
└── index.ts           → Точка входа

## 🧩 Архитектурный подход
Приложение построено по паттерну MVP:

Model — отвечает за бизнес-логику и работу с API.

View — отображение UI и работа с DOM.

Presenter — связывает Model и View, управляет логикой.

EventEmitter используется для обмена событиями между слоями (слабое связывание).

🧠 Компоненты и их назначение

ProductModel - Загружает товары с сервера, хранит каталог
CartModel - Хранит состояние корзины, добавление и удаление товаров
OrderModel - Сохраняет шаги оформления заказа, валидирует поля
ApiClient - Взаимодействие с API: товары и отправка заказа
CatalogView - Отображение карточек товаров
ModalView - Универсальные модальные окна (детали товара, уведомления)
CartView - Отображение корзины, управление товарами
CheckoutView - Интерфейс оформления заказа (два шага)
AppPresenter - Главный координатор: подписка на события, связывает всё
EventEmitter - Рассылает события по всему приложению

## 🔌 Взаимодействие компонентов
AppPresenter подписывается на события из View (добавление товара, отправка формы).

Все взаимодействия между Model и View проходят через Presenter.

Model не знает о View, и наоборот.

Данные передаются между слоями в виде строго типизированных объектов.

Базовые утилиты (EventEmitter, formatPrice) переиспользуются по всей системе.

## 🧾 Типы данных
Типы находятся в src/types/ и разделены по смыслу:

product.ts: описание товара с API (ProductServer) и для отображения (ProductView)

cart.ts: интерфейсы товаров в корзине, функции модели корзины

order.ts: интерфейсы данных заказа (адрес, оплата, контактные данные)

api.ts: интерфейс IApiClient

model.ts: интерфейсы всех моделей (IProductModel, ICartModel, IOrderModel)

view.ts: интерфейсы всех отображений (ICatalogView, IModalView, ...)

events.ts: список событий и их сигнатуры

presenter.ts: интерфейс AppPresenter