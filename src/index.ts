import { getProducts } from './api/getProducts';
import { cartStore } from './components/cartStore';
import { Basket } from './components/ui/Basket';
import { Contacts } from './components/ui/Contacts';

import { Modal } from './components/ui/Modal';
import { Order } from './components/ui/Order';
import { ProductCatalogCard } from './components/ui/ProductCatalogCard';
import { ProductPreviewCard } from './components/ui/ProductPreviewCard';
import { Success } from './components/ui/Success';

import './scss/styles.scss';
import { IOrderPayload, IProductItem } from './types';
import { ensureElement } from './utils/utils';

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// const page = new Page(document.body);
// const modal = new Modal(modalContainer);
const onCartSizeUpdated = () => {
	document.querySelector('.header__basket-counter').textContent =
		cartStore.size.toString();
};
const orderPayload: IOrderPayload = {
	payment: '',
	address: '',
	email: '',
	phone: '',
	items: [],
	total: 0,
};
getProducts().then(({ items }) => {
	const productList = items.map((item) => new ProductCatalogCard(item));
	productList.forEach((item) => {
		item.eventEmitter.on('click', (value: IProductItem) => {
			const productPreviewCard = new ProductPreviewCard(value);
			productPreviewCard.eventEmitter.on('update-cart', onCartSizeUpdated);
			new Modal().append(productPreviewCard).show();
		});
	});
	document.body
		.querySelector('.gallery')
		.append(...productList.map((item) => item.element));
});

const onOrderSubmit = () => {
	const contacts = new Contacts();
	const modal = new Modal().append(contacts);
	modal.show();
	contacts.eventEmitter.on(
		'submit',
		({ phone, email }: { phone: string; email: string }) => {
			modal.clear();
			modal.hide();
			orderPayload.email = email;
			orderPayload.phone = phone;
			onContactsCubmit();
		}
	);
};

const onCartSubmit = () => {
	const order = new Order();
	const modal = new Modal().append(order);
	modal.show();
	order.eventEmitter.on(
		'submit',
		({ orderType, address }: { orderType: string; address: string }) => {
			modal.clear();
			modal.hide();
			orderPayload.payment = orderType;
			orderPayload.address = address;
			onOrderSubmit();
		}
	);
};
document.querySelector('.header__basket').addEventListener('click', () => {
	const basket = new Basket();
	const modal = new Modal().append(basket);
	basket.eventEmitter.on('delete-item', () => {
		onCartSizeUpdated();
	});
	basket.eventEmitter.on('submit', () => {
		modal.clear();
		modal.hide();
		orderPayload.items = Array.from(cartStore.values()).map(
			(item) => item.title
		);
		orderPayload.total = Array.from(cartStore.values()).reduce(
			(acc, item) => acc + item.price,
			0
		);
		onCartSubmit();
	});
	modal.show();
});

const onContactsCubmit = () => {
	const success = new Success(orderPayload);
	const modal = new Modal().append(success);
	modal.show();
	const clear = () => {
		orderPayload.address = '';
		orderPayload.email = '';
		orderPayload.items = [];
		orderPayload.payment = '';
		orderPayload.phone = '';
		orderPayload.total = 0;
		cartStore.clear();
		onCartSizeUpdated();
	};
	modal.eventEmitter.on('hide', clear);
	success.eventEmitter.on('close', () => {
		modal.clear();
		modal.hide();
		clear()
	});
};
document.querySelector('.modal_active').classList.remove('modal_active');
