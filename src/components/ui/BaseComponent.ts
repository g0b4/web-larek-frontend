import { cloneTemplate } from '../../utils/utils';
import { EventEmitter } from '../base/events';

export interface IComponent {
	element: HTMLElement;
}

export class BaseComponent implements IComponent {
	public element: HTMLElement;
	public readonly eventEmitter: EventEmitter;
	protected template: HTMLTemplateElement;
	constructor() {
		this.eventEmitter = new EventEmitter();
	}
	protected emit(eventName: string, data?: object) {
		return this.eventEmitter.emit(eventName, data);
	}
	protected setTemplate(template: HTMLTemplateElement) {
		this.element = cloneTemplate(template);
	}
}

// const data = {};

// class Component<Props> {
// 	props: Props;
// 	emit = new EventEmitter();
// 	constructor(props: Props, { on }: { on: Record<string, () => void> }) {
// 		this.props = props;

// 		Object.entries(on).forEach(([key, value]) => {
// 			this.emit.on(key, value);
// 		});
// 	}
// }

// class ProductComponent extends Component<{value:IProductItem}> {
// 	constructor(props: {value:IProductItem}, { on }: { on: Record<string, () => void> }) {
// 		super(props, { on });

// this.element
// 	}
// }
