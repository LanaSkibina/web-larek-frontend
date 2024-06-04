import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';

// Интерфейс класса ISuccess
interface ISuccess {
	total: number;
}

// Интерфейс события по клику в форме об успешном оформлении заказа
interface ISuccessActions {
	onClick: () => void;
}

// Класс Success ответчает за отображение модального окна с информацией 
// об успешном оформлении заказа и списании средств со счета
export class Success extends Component<ISuccess> {
	protected _close: HTMLElement;
	protected _total: HTMLElement;

	constructor(container: HTMLElement, actions?: ISuccessActions) {
		super(container);

		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	// метод установки общей суммы заказа, которая была списана со счета
    set total(total: number) {
		this.setText(this._total, `Списано ${total} синапсов`);
	}
}
