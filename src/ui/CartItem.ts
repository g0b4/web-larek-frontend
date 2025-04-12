interface CartItemOptions {
  onRemove: () => void;
}

interface CartItemData {
  index: number;
  title: string;
  price: number;
}

export class CartItem {
  private element: HTMLElement;
  private onRemove: () => void;

  constructor(template: HTMLTemplateElement, options: CartItemOptions) {
    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    this.onRemove = options.onRemove;
  }

  render(data: CartItemData): HTMLElement {
    this.element.querySelector('[data-id="index"]')!.textContent = `${data.index}`;
    this.element.querySelector('[data-id="title"]')!.textContent = data.title;
    this.element.querySelector('[data-id="price"]')!.textContent = `${data.price} ₽`;

    const removeButton = this.element.querySelector('[data-id="remove"]') as HTMLElement;
    if (removeButton) {
      removeButton.addEventListener('click', this.onRemove);
    }

    return this.element;
  }
}