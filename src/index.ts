import './scss/styles.scss';

import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { AppState } from './components/AppState';
import { Card, CardPreview } from './components/Card';
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { Order } from './components/OrderForm';
import { IOrder, IProduct, IOrderForm, IContactsForm } from './types';
import { ContactsForm } from './components/ContactsForm';
import { Basket } from './components/Basket';
import { Success } from './components/Success';

const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);


// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const order = new Order(cloneTemplate<HTMLFormElement>(orderTemplate), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);
const basket = new Basket(cloneTemplate<HTMLTemplateElement>(basketTemplate), events);


// Бизнес-логика

// Изменились элементы каталога
events.on('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

// Превью карточки товара.
events.on('card:select', (item: IProduct) => {
	const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('card:add', item),
	});
	modal.render({
		content: card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
			description: item.description,
		}),
	});

	if (item.price === null) {
		card.setDisabled(card.buttonElement, true);
	} else if (appData.isInBasket(item)) {
		card.setDisabled(card.buttonElement, true);
	}
});

// Установка данных о добавленном элементе корзины
events.on('card:add', (item: IProduct) => {
	appData.addOrderID(item);
	appData.addToBasket(item);
	page.counter = appData.basket.length;
	modal.close();
});

// Открытие корзины
events.on('basket:open', () => {
	basket.total = appData.getTotal();
	basket.setDisabled(basket.button, appData.isEmpty);
	basket.items = appData.basket.map((item, index) => {
		const card = new CardPreview(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('card:remove', item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});
	modal.render({
		content: basket.render(),
	});
});

// Удаление карточки товара из корзины
events.on('card:remove', (item: IProduct) => {
	appData.removeFromBasket(item);
	appData.removeOrderID(item);
	page.counter = appData.basket.length;
	basket.setDisabled(basket.button, appData.isEmpty);
	basket.total = appData.getTotal();
	basket.items = appData.basket.map((item, index) => {
		const card = new CardPreview(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('card:remove', item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});
	modal.render({
		content: basket.render(),
	});
});

// Сборка формы заказа при открытии окна
events.on('order:open', () => {
	modal.render({
		content: order.render({
			address: '',
			payment: '',
			valid: false,
			errors: [],
		}),
	});
});

// Отправлена форма с телефоном и почтой
events.on('order:submit', () => {
	appData.order.total = appData.getTotal();
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { email, phone, address, payment } = errors;
	order.valid = !address && !payment;
	contacts.valid = !email && !phone;
	order.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Изменился способ оплаты в форме заказа
events.on('payment:change', (item: HTMLButtonElement) => {
	appData.order.payment = item.name;
	appData.validateOrderForm();
});

// Изменилось одно из полей
events.on(
	/^order\..*:change/,
	(data: { field: keyof IContactsForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Изменилось одно из полей контакта
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContactsForm; value: string }) => {
		appData.setContactsField(data.field, data.value);
	}
);

// Oтправка заказа после заполнения формы с контактами
events.on('contacts:submit', () => {
	api
		.createOrder(appData.order)
		.then((res) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});

			modal.render({
				content: success.render({
					total: res.total,
				}),
			});

			appData.clearBasket();
			page.counter = 0;
		})
		.catch((err) => {
			console.error(err);
		});
});


// Блокируем прокрутку страницы, если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

// Получаем карточки с сервера
api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
