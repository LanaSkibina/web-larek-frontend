import { Component } from './base/Component';
import { createElement, ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';

// Интерфейс корзины
interface IBasket {
	items: HTMLElement[];
	total: number;
}

// Класс Basket описывает корзину пользователя 
// Расширяет класс Component 
// Содержит список товаров, добавленных пользователем в корзину, и методы для изменения отображения корзины
export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this.button = this.container.querySelector('.basket__button');

		if (this.button) {
			this.button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.items = [];
	}

	// Установка списка элементов в корзине
	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	// Установка выбранных элементов в корзине
	set selected(items: string[]) {
		if (items.length) {
			this.setDisabled(this.button, false);
		} else {
			this.setDisabled(this.button, true);
		}
	}

	// Установка общей суммы заказа
	set total(total: number) {
		this.setText(this._total, `${total} синапсов`);
	}
}