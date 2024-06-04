import { Model } from './base/Model';
import {
	IOrder,
	IProduct,
	FormErrors,
	IContactsForm
} from '../types/index';

// Интерфейс для класса AppState
interface IAppState {
	catalog: IProduct[]; // Массив товаров в корзине
	basket: string[]; // Каталог товаров
	order: IOrder; // Текущий заказ
}

// Класс AppState наследуется от абстрактного класса Model 
// Oтвечает за состояние данных приложения и методы работы с ними
export class AppState extends Model<IAppState> {
	basket: IProduct[] = [];
	catalog: IProduct[];
	formErrors: FormErrors = {};
	order: IOrder = {
		total: 0,
		items: [],
		payment: '',
		address: '',
		email: '',
		phone: '',
	};

	// Установка каталога товаров
	setCatalog(items: IProduct[]) {
		this.catalog = items;
		this.emitChanges('items:changed');
	}

	// Добавление id товара в заказ
	addOrderID(item: IProduct) {
		this.order.items.push(item.id);
	}

    // Добавление товара в корзину
	addToBasket(item: IProduct) {
		this.basket.push(item);
	}

	// Удаление id товара из заказа
	removeOrderID(item: IProduct) {
	}

	// Удаление товара из корзины
	removeFromBasket(item: IProduct) {
	}

	// Очистка корзины
	clearBasket() {
		this.basket = [];
		this.order.items = [];
	}

	// Получение общей суммы заказа
	getTotal() {
		return this.order.items.reduce(
			(a, c) => a + this.catalog.find((it) => it.id === c).price,
			0
		);
	}

	// Установка поля заказа
	setOrderField(field: keyof IContactsForm, value: string) {
		this.order[field] = value;

		if (this.validateOrderForm()) {
			this.events.emit('order:ready', this.order);
		}
	}

	// Установка поля контакта
	setContactsField(field: keyof IContactsForm, value: string) {
		this.order[field] = value;

		if (this.validateContactsForm()) {
			this.events.emit('order:ready', this.order);
		}
	}

	// Проверка наличия переданного товара в корзине
	isInBasket(item: IProduct) {
		return this.basket.includes(item);
	}

	// Валидация формы cо способом оплаты и адресом
	validateOrderForm() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Укажите адрес';
		}

		if (!this.order.payment) {
			errors.address = 'Выберите способ оплаты';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	// Валидация формы с телефоном и email
	validateContactsForm() {
		const errors: typeof this.formErrors = {};

		if (!this.order.email) {
			errors.email = 'Укажите email';
		}

		if (!this.order.phone) {
			errors.phone = 'Укажите телефон';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	// Проверка заполнение корзины
	get isEmpty(): boolean {
		return this.basket.length === 0;
	}
}
