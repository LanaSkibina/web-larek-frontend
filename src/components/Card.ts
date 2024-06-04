import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { Category } from '../utils/constants';


// Интерфейс карточки товара
interface ICard {
	id: string;
	title: string;
	category: string;
	description: string;
    price: number | null;
	image: string;
	index?: number;
}

// Интерфейс события клика мышкой
interface ICardActions {
	onClick: (event: MouseEvent) => void;
}


// Расширяет абстрактный класс Component 
// и отвечает за отображение карточки товара в интерфейсе пользователя
export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;
	protected _category: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);
		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._image = container.querySelector(`.card__image`);
        this._category = container.querySelector(`.card__category`);
		this._price = ensureElement<HTMLImageElement>(`.card__price`, container);
		

		if (actions?.onClick) {
			container.addEventListener('click', actions.onClick);
		}
	}

	// метод установления идентификатора карточки
    set id(value: string) {
		this.container.dataset.id = value;
	}
	
    // метод получения идентификатора карточки
    get id(): string {
		return this.container.dataset.id || '';
	}
	
    // метод установления заголовка
    set title(value: string) {
		this.setText(this._title, value);
	}

	// метод установления значения изображения
    set image(value: string) {
		this.setImage(this._image, value);
	}

	// метод установления значения цены
    set price(value: number) {
		value === null
			? this.setText(this._price, 'Бесценно')
			: this.setText(this._price, `${value} синапсов`);
	}

	// метод установления категории в карточке
    set category(value: string) {
		this.setText(this._category, value);
		this._category.className = `card__category card__category_${Category[value]}`;
	}
}

// Отвечает за отображение карточки товара в модальном окне
export class CardPreview extends Card {
	protected _index: HTMLElement;
	protected _description: HTMLElement;
	buttonElement: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);
		this.buttonElement = container.querySelector('.card__button');
		this._index = container.querySelector('.basket__item-index');
        this._description = container.querySelector('.card__text');
		if (actions?.onClick) {
			if (this.buttonElement) {
				this.buttonElement.addEventListener('click', actions.onClick);
			}
		}
	}

	// метод установления индекса карточки
    set index(value: number) {
		this.setText(this._index, value);
	}

	// метод установления описания товара в карточке
    set description(value: string) {
		this.setText(this._description, value);
	}
}
