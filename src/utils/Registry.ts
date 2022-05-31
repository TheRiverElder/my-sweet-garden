export class Regsitry<K, V> {

    private entryMap = new Map<K, V>();
    private idMap = new Map<V, K>();

    register(id: K, value: V): V {
        this.entryMap.set(id, value);
        this.idMap.set(value, id);
        return value;
    }

    get(id: K): V | undefined {
        return this.entryMap.get(id);
    }

    getOrDefault(id: K, defaultValue: V): V {
        return this.entryMap.has(id) ? this.entryMap.get(id) : defaultValue;
    }

    getIdOf(value: V): K | undefined {
        return this.idMap.get(value);
    }
}
