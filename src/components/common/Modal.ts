import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';

// Интерфейс модального окна
interface IModal {
	content: HTMLElement;
}

// Наследует абстрактный класс Component 
// Класс Modal отвечает за отображение и взаимодействие с модальным окном в пользовательском интерфейсе
export class Modal extends Component<IModal> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

    // Установка содержимого модального окна
    set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	// Открытие модального окна
    open() {
		this.toggleClass(this.container, 'modal_active', true);
		this.events.emit('modal:open');
	}

	// Закрытие модального окна
    close() {
		this.toggleClass(this.container, 'modal_active', false);
		this.content = null;
		this.events.emit('modal:close');
	}

	// Сборка модального окна с установленным содержимым
    render(data: IModal): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
	
}
