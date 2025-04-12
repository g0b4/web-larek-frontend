import { IModalData } from "../types/index";
import { ensureElement } from "../utils/domHelpers";
import { Component } from "../core/Component";
import { IEvents } from "../core/EventBus";

export class PopupManager extends Component<IModalData> {
  protected _button: HTMLButtonElement;
  protected _content: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.events = events;
    this._button = ensureElement<HTMLButtonElement>('.modal__close', container);
    this._content = ensureElement<HTMLElement>('.modal__content', container);

    this._button.addEventListener('click', () => {
      this.close();
    });

    this.container.addEventListener('mousedown', (evt) => {
      if (evt.target === evt.currentTarget) {
        this.close();
      }
    });
  }

  set content(content: HTMLElement | null) {
    this._content.replaceChildren(...(content ? [content] : []));
  }

  open() {
    this.container.classList.add('modal_active');
    this.events.emit('popup:show'); 
  }

  close() {
    this.container.classList.remove('modal_active');
    this.content = null;
    this.events.emit('popup:hide');
  }

  show(data: IModalData) {
    this.content = data.content;
    this.open();
  }

  hide() {
    this.close();
  }

  render(data: IModalData): HTMLElement {
    this.show(data);
    return this.container;
  }
}