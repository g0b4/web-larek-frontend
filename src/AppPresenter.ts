import { getProducts } from './api/getProducts';
import { submitOrder } from './api/submitOrder';
import { EventEmitter } from './components/base/events';
import {
	ActiveProductModel,
	OrderModel,
	ProductListModel,
} from './components/models';
import {
	BasketComponent,
	ContactsFormComponent,
	ModalComponent,
	OrderFormComponent,
	PageComponent,
	ProductBasketCard,
	ProductCatalogCard,
	ProductGallery,
	ProductPreviewCard,
	SuccessComponent,
} from './components/ui';
import { IEventEmitter } from './types/IEventEmitter';
import { cloneTemplate, ensureElement } from './utils/utils';
/**
 * @class AppPresenter
 * @description Презентер приложения
 */

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

