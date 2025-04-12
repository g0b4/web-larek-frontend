// Тип данных о товаре
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
  }
  
  // Заказ, оформляемый пользователем
  export interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
  }
  
  // Результат успешно оформленного заказа
  export interface IOrderResult {
	id: string;
	total: number;
  }
  
  // Данные, передаваемые в модальное окно
  export interface IModalData {
	content: HTMLElement;
  }
  
  // Общее состояние формы
  export interface IFormState {
	errors: string[];
	valid: boolean;
  }
  
  // Товар с дополнительным флагом, добавлен ли в корзину
  export interface IProductItem extends IProduct {
	basketState: boolean;
  }
  
  // Общие данные состояния приложения
  export interface IAppStateData {
	products: IProductItem[];
	basket: IProductItem[];
	order: IOrder;
  }
  
  // Данные для главной страницы
  export interface IPageData {
	counter: number;
	gallery: HTMLElement[];
	locked: boolean;
  }
  
  // Карточка товара
  export interface ICardData extends IProduct {
	buttonLabel: boolean;
	index?: number;
  }
  
  // Обработчики карточки
  export interface ICardAction {
	onClick?: () => void;
  }
  
  // Данные корзины
  export interface IBasketData {
	items: HTMLElement[];
	total: number;
  }
  
  // Данные формы контактов
  export interface IContactsForm {
	email: string;
	phone: string;
  }
  
  // Ошибки формы, ключи соответствуют полям заказа
  export type FormErrors = Partial<Record<keyof IOrder, string>>;
  
  // Данные успешного заказа
  export interface ISuccessData {
	description: number;
  }
  
  // Действия для окна успешного заказа
  export interface ISuccessAction {
	onClick: () => void;
  }