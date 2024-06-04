// Импорт интерфейса брокера событий
import { IEvents } from './events';

// Абстрактный класс, который хранит общие поля и методы для классов слоя данных
// Принимает в переменной T тип данных модели. 
// Передает сообщения брокера на другие слои с помощью метода emitChanges
export abstract class Model<T> {
	constructor(data: Partial<T>, protected events: IEvents) {
		Object.assign(this, data);
	}

	emitChanges(event: string, payload?: object) {
		this.events.emit(event, payload ?? {});
	}
}
