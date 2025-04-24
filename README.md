# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовыми компонентами
- src/components/models/ — папка с JS моделями
- src/models/base/ — папка с базовыми моделями
- src/types — папка с типами

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Перед установкой и запуском проекта необходимо проверить наличие файла .env с ключом `API_ORIGIN`, который указывает на адрес сервера API:

```
API_ORIGIN=https://example.com
```

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Общая концепция работы приложения

Приложение основано на упрощенной версии шаблона проектирования MVP. В данном контексте все приложение содержит общий Presenter, который координирует работу всех View и Model через событийно-ориентированный подход, используя механизм сообщений, которые возникают в результате определенных событий внутри отображений и моделей.


## Типы данных

### IProductItem
Интерфейс описания товара

```ts
export interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: ProductItemCategory;
	price: number;
}

export type ProductItemCategory =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил'
	| string;
```

### IOrder
Интерфейс описания заказа

```ts
export type IOrder = {
	payment: string;
	address: string;
	email: string;
	phone: string;
	items: IProductItem[];
};

```
### IOrderPayload
Интерфейс описания заказа в формате API

```ts
export interface IOrderPayload {
	payment: string;
	address: string;
	email: string;
	phone: string;
	items: string[];
	total: number;
}

```
### IOrderResponse
Интерфейс описания успешного ответа от сервера при отправке заказа

```ts
export interface IOrderResponse {
	id: string;
	total: number;
}
```
### IListResponse
Интерфейс для ответа от сервера при запросе списка данных типа `T`

```ts
export type IListResponse<T> = {
	total: number;
	items: T[];
};
```
## Базовые и связующие блоки 

### Базовый http-клиент

Служит прослойкой для оформления запросов. Создает вариант `Api` с установленным baseUrl.

```ts
import { API_URL } from '../utils/constants';
import { Api } from './base/api';

/**
 * HttpClient - это класс, который помогает отправлять HTTP-запросы
 * @class
 * @extends Api
 */
export class HttpClient extends Api {
	/**
	 * Создает экземпляр класса
	 * @param {RequestInit} [options] - настройки запроса
	 */
	constructor(options: RequestInit = {}) {
		super(API_URL, {
			headers: {
				'Content-Type': 'application/json',
				...options.headers,
			},
		});
	}
}

/**
 * httpClient - это готовый экземпляр класса, который можно использовать
 * для отправки запросов. Он настроен на работу с API
 * @type {HttpClient}
 */
export const httpClient = new HttpClient();

```

### Базовый класс `EventEmitter`

Обеспечивает работу событий. Его функции: возможность установить и снять слушателей событий, вызвать слушателей при возникновении события

Реализует интерфейс `IEvents`, содержащий методы on, emit и trigger.
Для удобства в проекте используется интерфейс `IEventEmitter`, повторяющий `IEvents`, но содержащий фиксированный набор возможных событий в качестве типа аргумента `event`

```ts

// типизация названий событий для удобства
export type EmitterEvent = {
	'active-product-updated': null;
	'close-modal': null;
	'close-success': null;
	'current-product-updated': null;
	'open-basket': null;
	'open-contacts-form': null;
	'open-order-form': null;
	'open-product': { id: string };
	'open-success': null;
	'order-field:input': { field: keyof IOrder; value: any };
	'order-updated': null;
	'order-errors-updated': null;
	'product-list-updated': null;
	'remove-from-cart': { id: string };
	'toggle-active-product': null;
	'submit:contacts': null;
} & { [K in `order-updated:${keyof IOrder}`]: { value: unknown } };

export interface IEventEmitter {
	on<TEventKey extends keyof EmitterEvent>(
		event: TEventKey,
		callback: (data: EmitterEvent[TEventKey]) => void
	): void;
	emit<TEventKey extends keyof EmitterEvent>(
		event: TEventKey,
		data?: EmitterEvent[TEventKey]
	): void;
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
}

```
| Название события | Описание | Параметры |
| --- | --- | --- |
| `active-product-updated` | Событие обновления активного продукта | - |
| `close-modal` | Событие закрытия модалки | - |
| `close-success` | Событие закрытия окна успеха | - |
| `current-product-updated` | Событие обновления текущего продукта | - |
| `open-basket` | Событие открытия корзины | - |
| `open-contacts-form` | Событие открытия формы контактов | - |
| `open-order-form` | Событие открытия формы заказа | - |
| `open-product` | Событие открытия продукта | id: string |
| `open-success` | Событие открытия окна успеха | - |
| `order-field:input` | Событие обновления поля заказа | field: keyof IOrder, value: any |
| `order-updated` | Событие обновления заказа | - |
| `order-errors-updated` | Событие обновления ошибок заказа | - |
| `product-list-updated` | Событие обновления списка продуктов | - |
| `remove-from-cart` | Событие удаления продукта из корзины | id: string |
| `toggle-active-product` | Событие переключения активного продукта | - |
| `submit:contacts` | Событие отправки формы контактов | - |
| `order-updated:${keyof IOrder}` | Событие обновления поля заказа | value: unknown (фактически поле IOrder, соответствующее ключу) |

### Абстрактный класс `AbstractModel`

Абстрактный класс для создания конкретных моделей с типом `T`. 
- В качестве параметра конструктора принимает `IEventEmitter`. 
- Имеет абстрактный метод `reset()` для сброса состояния
- Имеет метод `setValue(value: T)` для обновления текущего значения 

```ts
export abstract class AbstractModel<T> {
	value: T;
	eventEmitter: IEventEmitter;
	abstract reset(): void;
	setValue(value: T) {
		this.value = value;
	}
	constructor(eventEmitter: IEventEmitter) {
		this.eventEmitter = eventEmitter;
		this.reset();
	}
}

```
### Абстрактный класс `Component` 

Абстрактный класс для создания конкретных `view`. Хранит html-элемент и эмиттер событий
- В качестве параметра конструктора принимает `HTMLElement` и `IEventEmitter`. 
- Имеет метод `getElement()` для отдачи html-элемента

```ts
export abstract class Component {
	protected element: HTMLElement;
	protected eventEmitter: IEventEmitter;
	constructor(element: HTMLElement, eventEmitter: IEventEmitter) {
		this.element = element;
		this.eventEmitter = eventEmitter;
	}
	getElement() {
		return this.element;
	}
}
```


## Модели данных (Model)

### Класс `OrderModel`


Служит для реализации модели заказа `IOrder`. Отвечает за все действия, связанные с конкретным объектом заказа. Отправляет наружу события, связанные с изменением заказа.

```ts
export class OrderModel extends AbstractModel<IOrder> {
	/**
	 * Текущий заказ
	 *
	 * @type {IOrder}
	 */
	value: IOrder;

	/**
	 * Ошибки при отправке заказа
	 *
	 * @type {string[]}
	 */
	errors: string[] = [];

	/**
	 * Создает экземпляр модели заказа
	 *
	 * @param {IEventEmitter} eventEmitter - диспетчер событий
	 */
	constructor(eventEmitter: IEventEmitter) {
		super(eventEmitter);
	}

	/**
	 * Сбрасывает заказ к изначальному состоянию
	 */
	reset() {
		this.setValue({
			payment: '',
			address: '',
			email: '',
			phone: '',
			items: [],
		});
		this.eventEmitter.emit('order-updated');
		this.eventEmitter.emit('order-updated:items');
	}

	/**
	 * Обновляет заказ
	 *
	 * @param {IOrder} value - новый заказ
	 */
	setValue(value: IOrder) {
		this.value = value;
		this.eventEmitter.emit('order-updated');
	}

	/**
	 * Обновляет поле заказа
	 *
	 * @param {keyof IOrder} field - поле заказа
	 * @param {IOrder[keyof IOrder]} value - новое значение поля
	 */
	updateField<K extends keyof IOrder>(field: K, value: IOrder[K]) {
		Object.assign(this.value, { [field]: value });
		this.eventEmitter.emit('order-updated');
		this.eventEmitter.emit(('order-updated:' + field) as keyof EmitterEvent, {
			value,
		});
	}

	/**
	 * Проверяет, является ли заказ валидным
	 *
	 * @returns {boolean} - true, если заказ валидный
	 */
	validateOrder(): boolean {
		return this.value.payment && this.value.address?.length > 0;
	}

	/**
	 * Проверяет, является ли контакт валидным
	 *
	 * @returns {boolean} - true, если контакт валидный
	 */
	validateContacts(): boolean {
		return this.value.email?.length > 0 && this.value.phone?.length > 0;
	}

	/**
	 * Преобразует заказ в формат, пригодный для отправки на сервер
	 *
	 * @returns {IOrderPayload} - заказ в формате, пригодном для отправки на сервер
	 */
	toOrderPayload(): IOrderPayload {
		return {
			...this.value,
			items: this.value.items.map((item) => item.id),
			total: this.total,
		};
	}

	/**
	 * Обновляет ошибки при отправке заказа
	 *
	 * @param {string[]} errors - ошибки при отправке заказа
	 */
	updateErrors(errors: string[]) {
		this.errors = errors;
		this.eventEmitter.emit('order-errors-updated');
	}

	/**
	 * Проверяет, находится ли продукт в корзине
	 *
	 * @param {IProductItem} item - продукт
	 * @returns {boolean} - true, если продукт находится в корзине
	 */
	isInCart(item: IProductItem) {
		return this.value.items.some((product) => product.id === item.id);
	}

	/**
	 * Добавляет/удаляет продукт из корзины
	 *
	 * @param {IProductItem} product - продукт
	 */
	toggleProduct(product: IProductItem) {
		this.updateField(
			'items',
			this.isInCart(product)
				? this.value.items.filter((product) => product.id !== product.id)
				: [...this.value.items, product]
		);
	}

	/**
	 * Общая сумма заказа
	 *
	 * @type {number}
	 */
	get total() {
		return this.value.items.reduce((acc, item) => acc + item.price, 0);
	}
}

```

### Класс `ActiveProductModel`
Служит для реализации модели текущего выбранного продукта `IProductItem | null`

```ts
export class ActiveProductModel extends AbstractModel<IProductItem | null> {
	/**
	 * Текущий активный продукт
	 * @type {(IProductItem | null)}
	 */
	value: IProductItem | null;

	constructor(eventEmitter: IEventEmitter) {
		super(eventEmitter);
	}

	/**
	 * Сбрасывает модель до изначального состояния
	 */
	reset() {
		this.setValue(null);
	}

	/**
	 * Обновляет модель
	 * @param {IProductItem | null} value - новый активный продукт
	 */
	setValue(value: IProductItem | null) {
		this.value = value;
		this.eventEmitter.emit('active-product-updated');
	}
}
```

### Класс `ProductListModel`
Служит для реализации модели списка доступных продуктов `IProductItem[]`

```ts
export class ProductListModel extends AbstractModel<IProductItem[]> {
	/**
	 * Список продуктов
	 * @type {IProductItem[]}
	 */
	value: IProductItem[] = [];

	/**
	 * @param {IEventEmitter} eventEmitter - эмитер событий
	 */
	constructor(eventEmitter: IEventEmitter) {
		super(eventEmitter);
	}

	/**
	 * Обнуляет список продуктов
	 */
	reset() {
		this.setValue([]);
		this.eventEmitter.emit('product-list-updated');
	}

	/**
	 * Обновляет список продуктов
	 * @param {IProductItem[]} value - новый список продуктов
	 */
	setValue(value: IProductItem[]) {
		this.value = value;
		this.eventEmitter.emit('product-list-updated');
	}
}

```
## Презентер
Главный
### Класс `AppPresenter`
Основной презентер приложения. Связывает логику моделей с view-компонентами посредством event-эмиттера. Инициируется при открытии страницы.
```ts
export class AppPresenter {
	/**
	 * @description EventEmitter для общения между компонентами
	 */
	eventEmitter: IEventEmitter = new EventEmitter();

	/**
	 * @description Модель заказа
	 */
	orderModel = new OrderModel(this.eventEmitter);

	/**
	 * @description Модель списка продуктов
	 */
	productListModel = new ProductListModel(this.eventEmitter);

	/**
	 * @description Модель активного продукта
	 */
	activeProductModel = new ActiveProductModel(this.eventEmitter);

	/**
	 * @description Шаблон карточки продукта
	 */
	cardCatalogTemplateElement =
		ensureElement<HTMLTemplateElement>('#card-catalog');

	/**
	 * @description Шаблон карточки корзины
	 */
	cardBasketTemplateElement =
		ensureElement<HTMLTemplateElement>('#card-basket');

	/**
	 * @description View страницы
	 */
	pageView = new PageComponent(document.body, this.eventEmitter);

	/**
	 * @description View модального окна
	 */
	modalView = new ModalComponent(
		ensureElement('#modal-container'),
		this.eventEmitter
	);

	/**
	 * @description View галереи продуктов
	 */
	productGalleryView = new ProductGallery(
		ensureElement('.gallery'),
		this.eventEmitter
	);

	/**
	 * @description View карточки продукта
	 */
	productPreviewView = new ProductPreviewCard(
		cloneTemplate(ensureElement<HTMLTemplateElement>('#card-preview')),
		this.eventEmitter
	);

	/**
	 * @description View корзины
	 */
	basketView = new BasketComponent(
		cloneTemplate(ensureElement<HTMLTemplateElement>('#basket')),
		this.eventEmitter
	);

	/**
	 * @description View формы заказа
	 */
	orderFormView = new OrderFormComponent(
		cloneTemplate(ensureElement<HTMLTemplateElement>('#order')),
		this.eventEmitter
	);

	/**
	 * @description View формы контактов
	 */
	contactsFormView = new ContactsFormComponent(
		cloneTemplate(ensureElement<HTMLTemplateElement>('#contacts')),
		this.eventEmitter
	);

	/**
	 * @description View блока результата
	 */
	succesView = new SuccessComponent(
		cloneTemplate(ensureElement<HTMLTemplateElement>('#success')),
		this.eventEmitter
	);

	constructor() {
		/**
		 * @description Получаем список продуктов
		 */
		getProducts()
			.then((products) => {
				this.productListModel.setValue(products.items);
			})
			.catch((error) => {
				console.error(error);
				alert('Ошибка при получении товаров');
			});

		/**
		 * @description Слушаем обновление списка продуктов
		 */
		this.eventEmitter.on('product-list-updated', () => {
			this.productGalleryView.updateContent(
				this.productListModel.value.map((item) => {
					const component = new ProductCatalogCard(
						cloneTemplate(this.cardCatalogTemplateElement),
						this.eventEmitter
					);
					component.update(item);
					return component.getElement();
				})
			);
		});

		/**
		 * @description Слушаем открытие продукта
		 */
		this.eventEmitter.on('open-product', ({ id }) => {
			const item = this.productListModel.value.find((item) => item.id === id);
			this.activeProductModel.setValue(item);
		});

		/**
		 * @description Слушаем обновление активного продукта
		 */
		this.eventEmitter.on('active-product-updated', () => {
			// когда активный продукт меняется, нужно обновить состояние карточки активного продукта
			this.productPreviewView.update(
				this.activeProductModel.value,
				this.orderModel.isInCart(this.activeProductModel.value)
			);
			this.modalView.render(this.productPreviewView.getElement());
		});

		/**
		 * @description Слушаем событие добавления продукта
		 */
		this.eventEmitter.on('toggle-active-product', () => {
			this.orderModel.toggleProduct(this.activeProductModel.value);
		});

		/**
		 * @description Слушаем обновление заказа
		 */
		this.eventEmitter.on('order-updated:items', () => {
			this.pageView.updateCounter(this.orderModel.value.items.length);
			this.productPreviewView.updateButtonText(
				this.orderModel.isInCart(this.activeProductModel.value)
			);
			this.basketView.updateContent(
				this.orderModel.value.items.map((item, index) => {
					const component = new ProductBasketCard(
						cloneTemplate(this.cardBasketTemplateElement),
						this.eventEmitter
					);
					component.update(item, index);
					return component.getElement();
				})
			);
			this.basketView.updateTotal(this.orderModel.total);
		});

		/**
		 * @description Слушаем открытие корзины
		 */
		this.eventEmitter.on('open-basket', () => {
			this.modalView.render(this.basketView.getElement());
		});

		/**
		 * @description Слушаем открытие формы заказа
		 */
		this.eventEmitter.on('open-order-form', () => {
			this.modalView.render(this.orderFormView.getElement());
		});

		/**
		 * @description Слушаем изменение поля формы заказа
		 */
		this.eventEmitter.on('order-field:input', ({ field, value }) => {
			this.orderModel.updateField(field, value);
		});

		/**
		 * @description Слушаем обновление заказа
		 */
		this.eventEmitter.on('order-updated', () => {
			this.orderModel.updateErrors([]);
		});

		/**
		 * @description Слушаем обновление способа оплаты
		 */
		this.eventEmitter.on(
			'order-updated:payment',
			({ value }: { value: string }) => {
				this.orderFormView.updatePayment(value);
				this.validateOrder();
			}
		);

		/**
		 * @description Слушаем обновление адреса
		 */
		this.eventEmitter.on('order-updated:address', () => {
			this.validateOrder();
		});

		/**
		 * @description Слушаем обновление email
		 */
		this.eventEmitter.on('order-updated:email', () => {
			this.validateContacts();
		});

		/**
		 * @description Слушаем обновление телефона
		 */
		this.eventEmitter.on('order-updated:phone', () => {
			this.validateContacts();
		});

		/**
		 * @description Слушаем событие удаления из корзины
		 */
		this.eventEmitter.on('remove-from-cart', ({ id }) => {
			this.orderModel.updateField(
				'items',
				this.orderModel.value.items.filter((product) => product.id !== id)
			);
		});

		/**
		 * @description Слушаем открытие формы контактов
		 */
		this.eventEmitter.on('open-contacts-form', () => {
			this.modalView.render(this.contactsFormView.getElement());
		});

		/**
		 * @description Слушаем событие отправки контактов
		 */
		this.eventEmitter.on('submit:contacts', () => {
			submitOrder(this.orderModel.toOrderPayload())
				.then((response) => {
					this.modalView.render(this.succesView.getElement());
					this.succesView.updateTotal(response.total);
					this.orderModel.reset();
				})
				.catch((error) => {
					this.contactsFormView.updateErrors([error]);
				});
		});

		/**
		 * @description Слушаем событие закрытия блока результата
		 */
		this.eventEmitter.on('close-success', () => {
			this.modalView.clear();
			this.modalView.close();
		});

		/**
		 * @description Слушаем обновление ошибок
		 */
		this.eventEmitter.on('order-errors-updated', () => {
			this.contactsFormView.updateErrors(this.orderModel.errors);
		});
	}

	/**
	 * @description Валидация заказа
	 */
	validateOrder() {
		if (this.orderModel.validateOrder()) {
			this.orderFormView.updateSubmitButtonState({ disabled: false });
		} else {
			this.orderFormView.updateSubmitButtonState({ disabled: true });
		}
	}

	/**
	 * @description Валидация контактов
	 */
	validateContacts() {
		if (this.orderModel.validateContacts()) {
			this.contactsFormView.updateSubmitButtonState({ disabled: false });
		} else {
			this.contactsFormView.updateSubmitButtonState({ disabled: true });
		}
	}
}


```



## Отображения (View)

### PageComponent
  Компонент страницы. Объединяет элементы модалки и кнопки корзины

```ts

export class PageComponent extends Component {
	/**
	 * Элемент счетчика корзины
	 *
	 * @private
	 * @type {HTMLElement}
	 * @memberof PageComponent
	 */
	private cartCounterElement: HTMLElement;

	/**
	 * Кнопка корзины в хедере
	 *
	 * @private
	 * @type {HTMLButtonElement}
	 * @memberof PageComponent
	 */
	private headerBasketButton: HTMLButtonElement;

	constructor(element: HTMLElement, eventEmitter: IEventEmitter) {
		super(element, eventEmitter);

		this.cartCounterElement = ensureElement(
			'.header__basket-counter',
			this.element
		);
		this.headerBasketButton = ensureElement<HTMLButtonElement>(
			'.header__basket',
			this.element
		);
		ensureAllElements('.modal', this.element).forEach((modal) => {
			modal.classList.remove('modal_active');
		});
		this.headerBasketButton.addEventListener('click', () => {
			this.eventEmitter.emit('open-basket');
		});
	}

	/**
	 * Обновляет счетчик корзины
	 *
	 * @param {number} value - Новое значение счетчика
	 * @memberof PageComponent
	 */
	updateCounter(value: number) {
		this.cartCounterElement.textContent = value.toString();
	}
}
```

### BasketComponent


Компонент отображения корзины
```ts
export class BasketComponent extends Component {
	/**
	 * Список продуктов в корзине
	 */
	protected listElement: HTMLElement;
	/**
	 * Общая сумма заказа
	 */
	protected totalPriceElement: HTMLElement;
	/**
	 * Кнопка "Оформить заказ"
	 */
	protected buttonElement: HTMLButtonElement;

	constructor(element: HTMLElement, eventEmitter: IEventEmitter) {
		super(element, eventEmitter);

		this.listElement = ensureElement('.basket__list', this.element);
		this.totalPriceElement = ensureElement('.basket__price', this.element);
		this.buttonElement = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.element
		);
		this.buttonElement.addEventListener('click', () => {
			this.eventEmitter.emit('open-order-form');
		});
	}

	/**
	 * Обновляет список продуктов в корзине
	 * @param elements - список elements
	 */
	updateContent(elements: HTMLElement[]) {
		this.listElement.innerHTML = '';
		this.listElement.append(...elements);
	}

	/**
	 * Обновляет общую сумму заказа
	 * @param value - сумма заказа
	 */
	updateTotal(value: number) {
		this.totalPriceElement.textContent =
			new Intl.NumberFormat('ru-RU').format(value) + ' синапсов';
	}
}
```

### ProductCard

Абстрактный класс для карточек продуктов

```ts
export abstract class ProductCard extends Component {
	/**
	 * Элемент с заголовком продукта
	 */
	protected titleElement: HTMLElement;

	/**
	 * Элемент с ценой продукта
	 */
	protected priceElement: HTMLElement;

	/**
	 * @param element - HTML-элемент, содержащий компонент
	 * @param eventEmitter - эмиттер событий
	 */
	constructor(element: HTMLElement, eventEmitter: IEventEmitter) {
		super(element, eventEmitter);
		this.titleElement = ensureElement('.card__title', this.element);
		this.priceElement = ensureElement('.card__price', this.element);
	}

	/**
	 * Обновляет информацию о продукте
	 * @param value - обновленная информация о продукте
	 */
	update(value: IProductItem) {
		setElementData(this.element, { id: value.id });
		this.titleElement.textContent = value.title;
		this.priceElement.textContent =
			Intl.NumberFormat('ru-RU').format(value.price) + ' синапсов';
	}

	/**
	 * Возвращает ID продукта
	 */
	get id() {
		return getElementData<{ id: string }>(this.element, {
			id: (value: string) => value,
		}).id;
	}
}
```

### ProductWithImageCard
Абстрактный класс для карточек, имеющих изображение товара
```ts
export abstract class ProductWithImageCard extends ProductCard {
	/**
	 * Элемент-картинка
	 */
	protected imageElement?: HTMLImageElement;

	/**
	 * Элемент заголовка категории
	 */
	protected categoryTitleElement: HTMLElement;

	/**
	 * Map, который переводит тип категории в CSS-класс
	 */
	protected categoryClassMap: Record<ProductItemCategory, string> = {
		'софт-скил': 'soft',
		другое: 'other',
		дополнительное: 'additional',
		кнопка: 'button',
		'хард-скил': 'hard',
	};

	/**
	 * @param element - HTML-элемент, содержащий компонент
	 * @param eventEmitter - эмиттер событий
	 */
	constructor(element: HTMLElement, eventEmitter: IEventEmitter) {
		super(element, eventEmitter);
		this.imageElement = ensureElement<HTMLImageElement>(
			'.card__image',
			this.element
		);
		this.categoryTitleElement = ensureElement('.card__category', this.element);
		this.categoryTitleElement.classList.remove;
	}

	/**
	 * Обновляет информацию о продукте
	 * @param value - обновленная информация о продукте
	 */
	update(value: IProductItem) {
		super.update(value);
		setElementData(this.element, { id: value.id });
		this.imageElement.src = resolveImageUrl(value.image);
		this.categoryTitleElement.textContent = value.category;
		this.categoryTitleElement.className = 'card__category';
		this.categoryTitleElement.classList.add(
			bem('card', 'category', this.categoryClassMap[value.category]).name
		);
	}
}
```

### ProductCatalogCard
  Компонент карточки товара в каталоге.

```ts
export class ProductCatalogCard extends ProductWithImageCard {
	constructor(element: HTMLElement, eventEmitter: IEventEmitter) {
		super(element, eventEmitter);

		/**
		 * Слушатель события клика на карточку.
		 * @listens Event:open-product
		 */
		this.element.addEventListener('click', () => {
			eventEmitter.emit('open-product', {
				id: this.id,
			});
		});
	}

	/**
	 * Обновляет информацию о продукте в карточке.
	 * @param {IProductItem} value - обновленная информация о продукте
	 */
	update(value: IProductItem): void {
		super.update(value);
	}
}

```

### ProductPreviewCard
Компонент карточки с подробностями товара и кнопкой добавления в корзину
```ts

export class ProductPreviewCard extends ProductWithImageCard {
	/**
	 * Кнопка добавления в корзину или удаления из корзины
	 */
	protected cardButton: HTMLButtonElement;
	/**
	 * Элемент с текстом описания продукта
	 */
	protected cardTextElement: HTMLElement;
	/**
	 * Родительский контейнер, в котором будет отображаться модальное окно
	 */
	protected modalContainer: HTMLElement;

	/**
	 * Конструктор компонента предпросмотра продукта
	 * @param element - HTML-элемент, в котором будет отображаться компонент
	 * @param eventEmitter - объект для отправки событий
	 */
	constructor(element: HTMLElement, eventEmitter: IEventEmitter) {
		super(element, eventEmitter);
		this.modalContainer = ensureElement('#modal-container', document.body);
		this.categoryTitleElement.classList.remove('card__category_other');
		this.cardTextElement = ensureElement('.card__text', this.element);
		this.cardButton = ensureElement<HTMLButtonElement>(
			'.card__button',
			this.element
		);
		this.cardButton.addEventListener('click', () => {
			this.eventEmitter.emit('toggle-active-product');
		});
	}

	/**
	 * Обновляет данные компонента
	 * @param value - данные продукта
	 * @param isInCart - флаг, является ли продукт в корзине
	 */
	update(value: IProductItem, isInCart?: boolean) {
		super.update(value);
		this.cardTextElement.textContent = value.description;
		this.updateButtonText(isInCart);
	}

	/**
	 * Обновляет текст кнопки добавления в корзину/удаления из корзины
	 * @param isInCart - флаг, является ли продукт в корзине
	 */
	updateButtonText(isInCart: boolean) {
		this.cardButton.textContent = isInCart
			? 'Удалить из корзины'
			: 'Добавить в корзину';
	}
}
```
### ProductBasketCard
Компонент карточки товара в корзине
```ts
export class ProductBasketCard extends ProductCard {
	/**
	 * Элемент, содержащий индекс продукта в корзине
	 */
	protected indexElement: HTMLElement;
	/**
	 * Элемент, содержащий заголовок продукта
	 */
	protected titleElement: HTMLElement;
	/**
	 * Элемент, содержащий цену продукта
	 */
	protected priceElement: HTMLElement;
	/**
	 * Кнопка, удаляющая продукт из корзины
	 */
	protected removeButton: HTMLButtonElement;

	/**
	 * @param element - HTML-элемент, содержащий компонент
	 * @param eventEmitter - эмиттер событий
	 */
	constructor(element: HTMLElement, eventEmitter: IEventEmitter) {
		super(element, eventEmitter);

		this.indexElement = ensureElement('.basket__item-index', this.element);
		this.titleElement = ensureElement('.card__title', this.element);
		this.priceElement = ensureElement('.card__price', this.element);
		this.removeButton = ensureElement<HTMLButtonElement>(
			'.card__button',
			this.element
		);
		this.removeButton.addEventListener('click', () => {
			this.eventEmitter.emit('remove-from-cart', {
				id: this.id,
			});
		});
	}

	/**
	 * Обновляет информацию о продукте в корзине
	 * @param value - обновленная информация о продукте
	 * @param index - индекс продукта в корзине
	 */
	update(value: IProductItem, index?: number) {
		super.update(value);
		this.indexElement.textContent = String(index + 1);
		this.titleElement.textContent = value.title;
		this.priceElement.textContent =
			Intl.NumberFormat('ru-RU').format(value.price) + ' синапсов';
	}
}
```
### ProductGallery
  Компонент галереи доступных продуктов
```ts

export class ProductGallery extends Component {
	/**
	 * Обновляет содержимое галереи
	 *
	 * @param {HTMLElement[]} list - Список элементов для отображения
	 * @memberof ProductGallery
	 */
	updateContent(list: HTMLElement[]) {
		this.element.innerHTML = '';
		this.element.append(...list);
	}
}
```

### OrderFormComponent

Компонент формы заказа
```ts
export class OrderFormComponent extends Component {
	cashButton: HTMLButtonElement;
	cardButton: HTMLButtonElement;
	submitButton: HTMLButtonElement;
	addressInput: HTMLInputElement;
	errorsElement: HTMLElement;

	/**
	 * Конструктор компонента формы заказа
	 * @param element - HTML элемент
	 * @param eventEmitter - объект для отправки событий
	 */
	constructor(element: HTMLElement, eventEmitter: IEventEmitter) {
		super(element, eventEmitter);

		this.cashButton = ensureElement<HTMLButtonElement>(
			'button[name=cash]',
			this.element
		);
		this.cardButton = ensureElement<HTMLButtonElement>(
			'button[name=card]',
			this.element
		);
		this.submitButton = ensureElement<HTMLButtonElement>(
			'.order__button',
			this.element
		);
		this.addressInput = ensureElement<HTMLInputElement>(
			'input[name=address]',
			this.element
		);
		this.errorsElement = ensureElement<HTMLElement>(
			'.form__errors',
			this.element
		);

		this.addressInput.addEventListener('input', (e) => {
			this.eventEmitter.emit('order-field:input', {
				field: 'address',
				value: (e.target as HTMLInputElement).value,
			});
		});
		this.cardButton.addEventListener('click', () => {
			this.eventEmitter.emit('order-field:input', {
				field: 'payment',
				value: 'card',
			});
		});
		this.cashButton.addEventListener('click', () => {
			this.eventEmitter.emit('order-field:input', {
				field: 'payment',
				value: 'cash',
			});
		});
		this.submitButton.addEventListener('click', (e) => {
			e.preventDefault();
			this.eventEmitter.emit('open-contacts-form');
		});
	}

	/**
	 * Обновляет способ оплаты
	 * @param value - тип оплаты ('cash' или 'card')
	 */
	updatePayment(value: string) {
		if (value === 'cash') {
			this.cashButton.classList.add('button_alt-active');
		} else {
			this.cashButton.classList.remove('button_alt-active');
		}

		if (value === 'card') {
			this.cardButton.classList.add('button_alt-active');
		} else {
			this.cardButton.classList.remove('button_alt-active');
		}
	}

	/**
	 * Обновляет адрес
	 * @param value - новый адрес
	 */
	updateAddress(value: string) {
		this.addressInput.value = value;
	}

	/**
	 * Обновляет состояние кнопки отправки
	 * @param disabled - состояние кнопки (true - заблокирована, false - активна)
	 */
	updateSubmitButtonState({ disabled }: { disabled: boolean }) {
		this.submitButton.disabled = disabled;
	}

	/**
	 * Обновляет ошибки формы
	 * @param errors - массив строк с ошибками
	 */
	updateErrors(errors: string[]) {
		this.errorsElement.innerHTML = errors
			.map((error) => `<p>${error}</p>`)
			.join('');
	}
}

```
### ContactsFormComponent
 Компонент формы контактов
 
 ```ts
export class ContactsFormComponent extends Component {
	/**
	 * Кнопка отправки формы
	 * @type {HTMLButtonElement}
	 */
	submitButton: HTMLButtonElement;
	/**
	 * Поле ввода email
	 * @type {HTMLInputElement}
	 */
	emailInput: HTMLInputElement;
	/**
	 * Поле ввода телефона
	 * @type {HTMLInputElement}
	 */
	phoneInput: HTMLInputElement;
	/**
	 * Элемент, содержащий ошибки валидации
	 * @type {HTMLElement}
	 */
	errorsElement: HTMLElement;

	/**
	 * Creates an instance of ContactsFormComponent.
	 * @param {HTMLElement} element - Элемент, содержащий форму
	 * @param {IEventEmitter} eventEmitter - Эмиттер событий
	 */
	constructor(element: HTMLElement, eventEmitter: IEventEmitter) {
		super(element, eventEmitter);

		this.submitButton = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			this.element
		);
		this.emailInput = ensureElement<HTMLInputElement>(
			'input[name="email"]',
			this.element
		);
		this.phoneInput = ensureElement<HTMLInputElement>(
			'input[name="phone"]',
			this.element
		);

		this.emailInput.addEventListener('input', (e) => {
			this.eventEmitter.emit('order-field:input', {
				field: 'email',
				value: (e.target as HTMLInputElement).value,
			});
		});
		this.phoneInput.addEventListener('input', (e) => {
			this.eventEmitter.emit('order-field:input', {
				field: 'phone',
				value: (e.target as HTMLInputElement).value,
			});
		});

		this.errorsElement = ensureElement<HTMLElement>(
			'.form__errors',
			this.element
		);

		this.submitButton.addEventListener('click', (e) => {
			e.preventDefault();
			this.eventEmitter.emit('submit:contacts');
		});
	}

	/**
	 * Обновляет значение поля телефона
	 * @param {string} value - Новое значение поля телефона
	 */
	updatePhone(value: string) {
		this.emailInput.value = value;
	}
	/**
	 * Обновляет значение поля email
	 * @param {string} value - Новое значение поля email
	 */
	updateEmail(value: string) {
		this.phoneInput.value = value;
	}
	/**
	 * Обновляет состояние кнопки отправки формы
	 * @param {{ disabled: boolean }} - Объект с состоянием кнопки
	 */
	updateSubmitButtonState({ disabled }: { disabled: boolean }) {
		this.submitButton.disabled = disabled;
	}
	/**
	 * Обновляет ошибки валидации
	 * @param {string[]} errors - Массив ошибок валидации
	 */
	updateErrors(errors: string[]) {
		this.errorsElement.innerHTML = errors
			.map((error) => `<p>${error}</p>`)
			.join('');
	}
}
```

### SuccessComponent
Компонент окна-уведомления об успешной отправке заказа
```ts
export class SuccessComponent extends Component {
	/**
	 * Элемент, содержащий описание заказа.
	 * @protected
	 */
	protected descriptionElement: HTMLElement;

	/**
	 * Кнопка закрытия окна.
	 * @protected
	 */
	protected closeButton: HTMLElement;

	/**
	 * Создаёт экземпляр SuccessComponent.
	 * @param element - HTML-элемент, содержащий компонент.
	 * @param eventEmitter - эмиттер событий.
	 */
	constructor(element: HTMLElement, eventEmitter: IEventEmitter) {
		super(element, eventEmitter);

		this.descriptionElement = ensureElement(
			'.order-success__description',
			this.element
		);
		this.closeButton = ensureElement('.order-success__close', this.element);
		this.closeButton.addEventListener('click', () => {
			this.eventEmitter.emit('close-success');
		});
	}

	/**
	 * Обновляет текстовое описание заказа.
	 * @param value - общая сумма заказа.
	 */
	updateTotal(value: number) {
		this.descriptionElement.textContent = `Списано ${value} синапсов`;
	}
}

```