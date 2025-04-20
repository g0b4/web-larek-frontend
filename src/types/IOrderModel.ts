import { IProductItem } from '../types';

export type IOrderModel = {
    payment: string;
    address: string;
    email: string;
    phone: string;
    items: IProductItem[];
    total: number;
};
