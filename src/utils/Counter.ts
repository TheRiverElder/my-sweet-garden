export class Counter {
    private value: number = 0;

    constructor(initialValue: number = 0) {
        this.value = initialValue;
    }
    
    get(): number {
        return this.value;
    }

    change(delta: number): number {
        return this.value += delta;
    }

    increment(): number {
        return this.value++;
    }

    decrement(): number {
        return this.value--;
    }

    getAndIncrement(): number {
        return this.value++;
    }

    getAnddecrement(): number {
        return this.value--;
    }
}