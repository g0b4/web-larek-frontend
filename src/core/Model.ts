import { IEvents } from './EventBus';


export const isModel = (obj: unknown): obj is Model<any> => {
	return obj instanceof Model;
};


export abstract class Model<T> {
  protected state: Partial<T> = {};

  constructor(data: Partial<T>, protected events: IEvents) {
    this.state = data;
    Object.assign(this, data);
  }

  protected emitChanges(): void {
    this.events.emit('state:change', this.state);
  }


  public setState(newState: Partial<T>): void {
    Object.assign(this.state, newState);
    this.emitChanges();
  }

  public getState(): Partial<T> {
    return this.state;
  }
}