export class Timer {
    constructor() {
        this.time;
        this.total = 0;
        this.latest = 0;
    }

    start(n=0) {
        this.t0 = new Date();
        // console.log("Timer started");
        this.interaval = setInterval(this.timer.bind(this), 1000);
    }

    stop() {
        // console.log("Timer stopped");
        this.total += this.time;
        this.latest = new Date();
        clearInterval(this.interaval);
    }

    Ttotal() {
        return this.formatTime(this.total);
    }

    timer() {
        let t = new Date();
        let diff = t.getTime() - this.t0.getTime();
        this.time = diff;
        return this.time;
    }

    formatTime(time) {
        let days = Math.floor(time / 1000 / 60 / 60 / 24);
        let hours = Math.floor(time / 1000 / 60 / 60 % 24);
        let minutes = Math.floor(time / 1000 / 60 % 60);
        let seconds = Math.floor(time / 1000 % 60);
        return `${days}:${hours}:${minutes}:${seconds}`;
    }
}