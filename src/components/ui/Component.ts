import { IAppState } from '../../types/IAppState';

export abstract class Component {
	protected appState: IAppState;
	protected element: HTMLElement;
	constructor(element: HTMLElement, appState: IAppState) {
		this.element = element;
		this.appState = appState;
	}
	getElement() {
		return this.element;
	}
}
