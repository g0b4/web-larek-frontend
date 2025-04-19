import { API_URL } from '../utils/constants';
import { Api } from './base/api';

export class HttpClient extends Api {
	constructor(options: RequestInit = {}) {
		super(API_URL, {
			headers: {
				'Content-Type': 'application/json',
				...options.headers,
			},
		});
	}
}

export const httpClient = new HttpClient();
