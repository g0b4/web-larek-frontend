import { API_URL } from '../utils/constants';
import { Api } from './base/api';

/**
 * HttpClient - это класс, который помогает отправлять HTTP-запросы
 * @class
 * @extends Api
 */
export class HttpClient extends Api {
	/**
	 * Создает экземпляр класса
	 * @param {RequestInit} [options] - настройки запроса
	 */
	constructor(options: RequestInit = {}) {
		super(API_URL, {
			headers: {
				'Content-Type': 'application/json',
				...options.headers,
			},
		});
	}
}

/**
 * httpClient - это готовый экземпляр класса, который можно использовать
 * для отправки запросов. Он настроен на работу с API
 * @type {HttpClient}
 */
export const httpClient = new HttpClient();
