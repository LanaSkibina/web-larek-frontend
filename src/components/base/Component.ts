// Абстрактный класс для работы с компонентами отображения. 
// Используется для создания компонентов пользовательского интерфейса

export abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {}

	// Переключение класса
	toggleClass(element: HTMLElement, className: string, force?: boolean) {
		element.classList.toggle(className, force);
	}

	// Устанавка текста для переданного в конструктор элемента
	protected setText(element: HTMLElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}

	// Блокировка для переданного элемента
	setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}

	// Сокрытие переданного элемента
	protected setHidden(element: HTMLElement) {
		element.style.display = 'none';
	}

	// Показ переданного элемента
	protected setVisible(element: HTMLElement) {
		element.style.removeProperty('display');
	}

	// Устанавка изображения для переданного в конструктор элемента с альтернативным текстом
	protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
			element.src = src;
			if (alt) {
				element.alt = alt;
			}
		}
	}

	// Сборка корневго DOM-элемента на основе переданных данных
	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}
