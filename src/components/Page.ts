import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';


// Интерфейс класса Page
interface IPage {
	counter: HTMLElement; // Счетчик на странице
	catalog: HTMLElement; //Каталог товаров или элементов
	basket: HTMLElement; // Отображение корзины
}

// Наследует абстрактный класс Component и отвечает за отображение 
// главной страницы сайта с каталогом товаров и счетчиком товаров в корзине
export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._catalog = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basket = ensureElement<HTMLElement>('.header__basket');

		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	// Установка значения счетчика товаров в корзине
	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	// Устанавка полученного содержимого каталога
	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	// Блокировка прокрутки страницы при открытии модального окна
	set locked(value: boolean) {
        this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
    }
}
