export type AppEvent =
  | 'product:add'
  | 'product:remove'
  | 'cart:open'
  | 'cart:clear'
  | 'order:submit'
  | 'modal:open'
  | 'modal:close';

export interface EventPayloadMap {
  'product:add': { id: string };
  'product:remove': { id: string };
  'cart:open': void;
  'cart:clear': void;
  'order:submit': void;
  'modal:open': HTMLElement;
  'modal:close': void;
}
