import { getProducts } from './api/getProducts';
import { submitOrder } from './api/submitOrder';
import { EventEmitter } from './components/base/events';
import {
	ActiveProductModel,
	OrderModel,
	ProductListModel,
} from './components/models';
import {
	PageComponent,
	ModalComponent,
	ProductCatalogCard,
	ProductGallery,
	ProductPreviewCard,
	BasketComponent,
	OrderFormComponent,
	ContactsFormComponent,
	SuccessComponent,
	ProductBasketCard,
} from './components/ui';
import { IProductItem } from './types';
import { IEventEmitter } from './types/IEventEmitter';
import { ensureElement, cloneTemplate } from './utils/utils';

export class AppPresenter {
	eventEmitter: IEventEmitter = new EventEmitter();
	orderModel = new OrderModel(this.eventEmitter);
	productListModel = new ProductListModel(this.eventEmitter);
	activeProductModel = new ActiveProductModel(this.eventEmitter);

	cardCatalogTemplateElement =
		ensureElement<HTMLTemplateElement>('#card-catalog');
	cardBasketTemplateElement =
		ensureElement<HTMLTemplateElement>('#card-basket');
	pageView = new PageComponent(document.body, this.eventEmitter);
	modalView = new ModalComponent(
		ensureElement('#modal-container'),
		this.eventEmitter
	);
	productCatalogView = new ProductCatalogCard(
		cloneTemplate(ensureElement<HTMLTemplateElement>('#card-catalog')),
		this.eventEmitter
	);
	productGalleryView = new ProductGallery(
		ensureElement('.gallery'),
		this.eventEmitter
	);
	productPreviewView = new ProductPreviewCard(
		cloneTemplate(ensureElement<HTMLTemplateElement>('#card-preview')),
		this.eventEmitter
	);
	basketView = new BasketComponent(
		cloneTemplate(ensureElement<HTMLTemplateElement>('#basket')),
		this.eventEmitter
	);
	orderFormView = new OrderFormComponent(
		cloneTemplate(ensureElement<HTMLTemplateElement>('#order')),
		this.eventEmitter
	);
	contactsFormView = new ContactsFormComponent(
		cloneTemplate(ensureElement<HTMLTemplateElement>('#contacts')),
		this.eventEmitter
	);
	succesView = new SuccessComponent(
		cloneTemplate(ensureElement<HTMLTemplateElement>('#success')),
		this.eventEmitter
	);

	constructor() {
		getProducts().then((products) => {
			this.productListModel.setValue(products.items);
		});
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
		this.eventEmitter.on('open-product', ({ id }) => {
			const item = this.productListModel.value.find((item) => item.id === id);
			this.activeProductModel.setValue(item);
		});
		this.eventEmitter.on('active-product-updated', () => {
			this.productPreviewView.update(
				this.activeProductModel.value,
				this.isInCart(this.activeProductModel.value)
			);
			this.modalView.render(this.productPreviewView);
		});
		this.eventEmitter.on('select-product', () => {
			this.orderModel.updateField(
				'items',
				this.isInCart(this.activeProductModel.value)
					? this.orderModel.value.items.filter(
							(product) => product.id !== this.activeProductModel.value.id
					  )
					: [...this.orderModel.value.items, this.activeProductModel.value]
			);
		});
		this.eventEmitter.on('order-updated:items', () => {
			this.pageView.updateCounter(this.orderModel.value.items.length);
			this.productPreviewView.updateButtonText(
				this.isInCart(this.activeProductModel.value)
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
		this.eventEmitter.on('open-basket', () => {
			this.modalView.render(this.basketView);
		});
		this.eventEmitter.on('open-order-form', () => {
			this.modalView.render(this.orderFormView);
		});

		this.eventEmitter.on('order-field:input', ({ field, value }) => {
			this.orderModel.updateField(field, value);
		});

		this.eventEmitter.on('order-updated', () => {
			this.orderModel.updateErrors([]);
		});

		this.eventEmitter.on(
			'order-updated:payment',
			({ value }: { value: string }) => {
				this.orderFormView.updatePayment(value);
				this.validateOrder();
			}
		);

		this.eventEmitter.on('order-updated:address', () => {
			this.validateOrder();
		});

		this.eventEmitter.on('order-updated:email', () => {
			this.validateContacts();
		});

		this.eventEmitter.on('order-updated:phone', () => {
			this.orderModel;
			this.validateContacts();
		});

		this.eventEmitter.on('remove-from-cart', ({ id }) => {
			this.orderModel.updateField(
				'items',
				this.orderModel.value.items.filter((product) => product.id !== id)
			);
		});

		this.eventEmitter.on('open-contacts-form', () => {
			this.modalView.render(this.contactsFormView);
		});
		this.eventEmitter.on('submit:contacts', () => {
			submitOrder(this.orderModel.asJson())
				.then((response) => {
					this.modalView.render(this.succesView);
					this.succesView.updateTotal(response.total);
					this.orderModel.reset();
				})
				.catch((error) => {
					this.contactsFormView.updateErrors([error]);
				});
		});

		this.eventEmitter.on('close-success', () => {
			this.modalView.clear();
			this.modalView.close();
		});

		this.eventEmitter.on('order-errors-updated', () => {
			this.contactsFormView.updateErrors(this.orderModel.errors);
		});
	}

	validateOrder() {
		if (this.orderModel.validateOrder()) {
			this.orderFormView.updateSubmitButtonState({ disabled: false });
		} else {
			this.orderFormView.updateSubmitButtonState({ disabled: true });
		}
	}

	validateContacts() {
		if (this.orderModel.validateContacts()) {
			this.contactsFormView.updateSubmitButtonState({ disabled: false });
		} else {
			this.contactsFormView.updateSubmitButtonState({ disabled: true });
		}
	}
	isInCart(item: IProductItem) {
		return this.orderModel.value.items.some(
			(product) => product.id === item.id
		);
	}
}
