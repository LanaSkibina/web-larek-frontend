import { Api, ApiListResponse } from './base/api';
import { IProduct, IOrderResult, IOrder } from '../types/index';


// Интерфейс для работы с API магазина WebLarek
interface ILarekApi {
	getProductList: () => Promise<IProduct[]>; // Получение списка всех продуктов, доступных в магазине
	createOrder: (value: IOrder) => Promise<IOrderResult>; // Отправка заказа на сервер
}

// Расширяет базовый класс Api для работы с API приложения WebLarek
// Конструктор наследуется от базового класса Api
export class LarekApi extends Api implements ILarekApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	// Геттер для получения списка товаров с сервера
    getProductList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	// Отправка заказа на сервер
    createOrder(value: IOrder): Promise<IOrderResult> {
		return this.post('/order', value).then((data: IOrderResult) => data);
	}
}
