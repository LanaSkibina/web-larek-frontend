// Интерфейс товара
export interface IProduct {
	id: string; // Идентификатор товара
	description: string; // Описание товара
	image: string; // Адрес изображения товара
	title: string; // Название товара
	category: string; // Категория товара
	price: number | null; // Цена товара
}


// Интерфейс для класса OrderForm
export interface IOrderForm {
	payment: string; // Способ оплаты
	address: string; // Адрес доставки
}

// Интерфейс для класса ContactsForm
export interface IContactsForm {
	email: string; // Email пользователя
	phone: string; // Телефон пользователя
}

// Интерфейс IOrder расширяет IOrderForm и IOrderContact
export interface IOrder extends IOrderForm, IContactsForm {
	total: number; // Общая сумма заказа
	items: string[]; // Массив строк из идентификаторов товаров в заказе
}

// Интерфейс для создание заказа
export interface IOrderResult {
	total: number; // идентификатор заказа
}


//Тип FormErrors используется для представления ошибок формы
export type FormErrors = Partial<Record<keyof IOrder, string>>;

