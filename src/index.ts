import './scss/styles.scss';

import { EventBus } from './core/EventBus';
import { ShoppingCart } from './core/ShoppingCart';
import {
  IProductItem,
  IOrderConfirmation,
  IContactDetails,
  IDeliveryInfo,
  IOrderForm,
  IProductData,
} from './types/models';
import { CartItem } from './ui/CartItem';
import { PopupManager } from './ui/PopupManager';
import { createFromTemplate, getElement } from './utils/domHelpers';
import { ProductCard } from './ui/ProductCard';
import { PageLayout } from './ui/PageLayout';
import { CartView } from './ui/CartView';
import { DeliveryForm } from './ui/DeliveryForm';
import { ContactForm } from './ui/ContactForm';
import { OrderComplete } from './ui/OrderComplete';
import { apiClient } from './core/api';

window.addEventListener('DOMContentLoaded', () => {
  const productCardTemplate = getElement<HTMLTemplateElement>('#card-catalog');
  const productModalTemplate = getElement<HTMLTemplateElement>('#card-preview');
  const cartItemTemplate = getElement<HTMLTemplateElement>('#card-basket');
  const cartTemplate = getElement<HTMLTemplateElement>('#basket');
  const deliveryFormTemplate = getElement<HTMLTemplateElement>('#order');
  const contactFormTemplate = getElement<HTMLTemplateElement>('#contacts');
  const orderCompleteTemplate = getElement<HTMLTemplateElement>('#success');

  const rootElement = getElement<HTMLElement>('.page');
  const popupContainer = getElement<HTMLElement>('#modal-container');

  const eventBus = new EventBus();
  const cart = new ShoppingCart(eventBus);
  const layout = new PageLayout(rootElement, eventBus);
  const popup = new PopupManager(popupContainer, eventBus);
  const cartView = new CartView(createFromTemplate(cartTemplate), eventBus);
  const deliveryForm = new DeliveryForm(createFromTemplate(deliveryFormTemplate), eventBus);
  const contactForm = new ContactForm(createFromTemplate(contactFormTemplate), eventBus);
  const orderComplete = new OrderComplete(createFromTemplate(orderCompleteTemplate), {
    onClick: () => popup.hide(),
  });

  const setupEventHandlers = () => {
    eventBus.on('products:updated', updateProductGrid);
    eventBus.on('product:selected', handleProductSelection);
    eventBus.on('product:details', showProductDetails);
    eventBus.on('cart:updated', updateCartView);
    eventBus.on('cart:view', openCart);
    eventBus.on('checkout:start', startCheckout);
    eventBus.on('form:changed', handleFormChange);
    eventBus.on('delivery:submitted', proceedToContactDetails);
    eventBus.on('validation:errors', handleValidationErrors);
    eventBus.on('order:finalized', completeOrder);
    eventBus.on('popup:show', () => layout.lockScroll());
    eventBus.on('popup:hide', () => layout.unlockScroll());
  };

  const updateProductGrid = () => {
    const products = cart.getAvailableProducts().map(product => {
      const card = new ProductCard(createFromTemplate(productCardTemplate), {
        onClick: () => eventBus.emit('product:selected', product),
      });

      return card.render({
        category: product.category,
        title: product.title,
        image: product.image,
        price: product.price,
        buttonLabel: product.basketState,
      });
    });

    layout.updateCartIndicator(cart.getCartItems().length);
    layout.renderProducts(products);
  };

  const handleProductSelection = (product: IProductItem) => {
    eventBus.emit('product:details', product);
  };

  const showProductDetails = (product: IProductItem) => {
    const card = new ProductCard(createFromTemplate(productModalTemplate), {
      onClick: () => {
        cart.toggleCartItem(product);
        popup.hide();
        eventBus.emit('cart:updated');
      },
    });

    popup.show({
      content: card.render({
        category: product.category,
        title: product.title,
        image: product.image,
        description: product.description,
        price: product.price,
        buttonLabel: product.basketState,
      }),
    });
  };

  const updateCartView = () => {
    const items = cart.getCartItems().map((item, position) => {
      const cartItem = new CartItem(createFromTemplate(cartItemTemplate), {
        onRemove: () => {
          cart.removeFromBasket(item);
          eventBus.emit('cart:updated');
        },
      });

      return cartItem.render({
        index: position + 1,
        title: item.title,
        price: item.price,
      });
    });

    cartView.items = items;
    cartView.total = cart.getCartTotal();
    layout.updateCartIndicator(cart.getCartItems().length);
  };

  const openCart = () => {
    popup.show({
      content: cartView.render(),
    });
  };

  const startCheckout = () => {
    popup.show({
      content: deliveryForm.render({
        address: '',
        errors: [],
        valid: false,
      }),
    });
  };

  const handleFormChange = (payload: {
    field: keyof (IContactDetails & IDeliveryInfo);
    value: string;
  }) => {
    const field = payload.field === 'paymentMethod' ? 'paymentMethod' : payload.field;

    cart.updateOrderInfo(field as keyof IContactDetails & keyof IDeliveryInfo, payload.value);
  };

  const proceedToContactDetails = () => {
    popup.show({
      content: contactForm.render({
        email: '',
        phone: '',
        errors: [],
        valid: false,
      }),
    });
  };

  const handleValidationErrors = (errors: Partial<IContactDetails & IDeliveryInfo>) => {
    const { paymentMethod, address, email, phone } = errors;

    deliveryForm.errors = Object.values({ paymentMethod, address }).filter(Boolean) as string[];
    deliveryForm.valid = !(paymentMethod || address);

    contactForm.errors = Object.values({ email, phone }).filter(Boolean) as string[];
    contactForm.valid = !(email || phone);
  };

  const completeOrder = () => {
    const order = cart.getOrderDetails();

    apiClient
      .placeOrder(order)
      .then((confirmation: IOrderConfirmation) => {
        popup.show({
          content: orderComplete.render({
            description: confirmation.total,
          }),
        });

        cart.clearCart();
        layout.updateCartIndicator(0);
        eventBus.emit('cart:updated');
      })
      .catch(console.error);
  };

  setupEventHandlers();

  apiClient
    .fetchProducts()
    .then((products: IProductData[]) => {
      cart.setProducts(products);
    })
    .catch(console.error);
});

