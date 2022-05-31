export class ObjectType<T> {
    
    private supplier: () => T;

    constructor(supplier: () => T) {
        this.supplier = supplier;
    }
    
    create(data?: object): T{
        const part = this.supplier();
        // part.type = this;
        return part;
    }
}