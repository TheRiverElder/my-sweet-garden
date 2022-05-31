export type EventHandler<V> = (value: V) => void; 

export class EventDispatcher<V> {

    private handlers: Set<EventHandler<V>> = new Set();

    on(handler: EventHandler<V>) {
        this.handlers.add(handler);
        return () => this.unon(handler);
    }

    unon(handler: EventHandler<V>) {
        this.handlers.delete(handler);
        return this;
    }

    emit(value: V) {
        this.handlers.forEach(h => h(value));
        return this;
    }
}