import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';


// Интерфейс формы
interface IForm {
	valid: boolean;
	errors: string[];
}


// Класс Form описывает компонент формы и реализует методы для управления состоянием и валидацией формы
// Наследует абстрактный класс Component
export class Form<T> extends Component<IForm> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});
		
		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	// генерация события уведомления подписчиков об изменении значения в формы
    protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value,
		});
	}

	// Метод установки флага валидности формы
    set valid(value: boolean) {
		this.setDisabled(this._submit, !value);
	}

	// Метод для установки ошибки формы при валидации
    set errors(value: string) {
		this.setText(this._errors, value);
	}

	// Cборка формы с новым состоянием
    render(state: Partial<T> & IForm) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}
