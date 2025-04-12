import { ICardAction, ICardData } from '../types';
import { ensureElement, formatNumber } from '../utils/domHelpers';
import { Component } from '../core/Component';

export class ProductCard extends Component<ICardData> {
    protected _category?: HTMLSpanElement;
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(container: HTMLElement, actions: ICardAction) {
        super(container);

        this._category = container.querySelector('.card__category');
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._image = container.querySelector('.card__image');
        this._description = container.querySelector('.card__text');
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._button = container.querySelector('.card__button');

        if (this._button) {
            this._button.addEventListener('click', actions.onClick);
        } else {
            this.container.addEventListener('click', actions.onClick);
        }
    }

    set category(value: string) {
        this.setText(this._category, value);

        const map: Record<string, string> = {
            'софт-скил': 'card__category_soft',
            'другое': 'card__category_other',
            'хард-скил': 'card__category_hard',
            'дополнительное': 'card__category_additional',
            'кнопка': 'card__category_button',
        };

        const className = map[value];
        if (className && this._category) {
            this._category.classList.add(className);
        }
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set image(value: string) {
        this.setImage(this._image, value);
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set price(value: number | null) {
        if (value === null) {
            this.setText(this._price, 'Бесценно');
            if (this._button) this.setHidden(this._button);
        } else {
            this.setText(this._price, formatNumber(value) + ' синапсов');
        }
    }

    set buttonLabel(productState: boolean) {
        if (productState) {
            this.setText(this._button, 'Удалить из корзины');
        } else {
            this.setText(this._button, 'Купить');
        }
    }
}