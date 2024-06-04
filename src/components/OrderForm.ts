import { Form } from './common/Form';
import { IEvents } from './base/events';
import { ensureAllElements } from '../utils/utils';
import { IOrderForm } from '../types/index';


// Отвечает за отображение формы заказа c адресом и выбором способа платежа
export class Order extends Form<IOrderForm> {
	protected _buttons: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._buttons = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			container
		);
		this._buttons.forEach((button) => {
			button.addEventListener('click', () => {
				this.payment = button.name;
				events.emit('payment:change', button);
			});
		});
	}

	// Изменение активности класса кнопок в зависимости от переданного типа оплаты
    set payment(name: string) {
		this._buttons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
	}

	// Установка адреса
    set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
