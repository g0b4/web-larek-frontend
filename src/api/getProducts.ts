import { httpClient } from '../components/httpClient';
import { IProductItem } from '../types';
import { IListResponse } from '../types/IListReponse';

export const getProducts = async () => {
	return httpClient.get('/product') as Promise<IListResponse<IProductItem>>;
};
