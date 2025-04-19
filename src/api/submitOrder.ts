import { httpClient } from '../components/httpClient';
import { IOrderResponse } from '../types';

export const submitOrder = async () => {
	return httpClient.get('/order') as Promise<IOrderResponse>;
};
