import { EventDispatcher } from "./EventDisppatcher";

export class Ticker extends EventDispatcher<number> {
    public time: number = 0;
    public period: number;

    constructor(period: number, initialTime: number = 0) {
        super();
        this.period = period;
        this.time = initialTime;
    }

    private pid: NodeJS.Timer = null;

    start() {
        if (this.pid === null) {
            this.pid = setInterval(() => this.emit(this.time), this.period);
        }
        return this;
    }

    stop() {
        if (this.pid !== null) {
            clearInterval(this.pid);
            this.pid = null;
        }
        return this;
    }
}