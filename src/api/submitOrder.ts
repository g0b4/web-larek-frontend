import { httpClient } from '../components/httpClient';
import { IOrderPayload, IOrderResponse } from '../types';

export const submitOrder = async (payload: IOrderPayload) => {
	return httpClient.post('/order', payload) as Promise<IOrderResponse>;
};
