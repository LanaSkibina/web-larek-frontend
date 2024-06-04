import { Form } from './common/Form';
import { IEvents } from './base/events';
import { IContactsForm } from '../types/index';


// Отвечает за отображение формы с контактами пользователя
export class ContactsForm extends Form<IContactsForm> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	// Устанавливает значение поля phone в форме
    set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	// Устанавливает значение поля email в форме
    set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}
