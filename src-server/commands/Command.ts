type FnRun = (args: string[]) => boolean

export default class Command {
    constructor(name: string, run: FnRun) {
        this.#name = name
        this.#onRun = run
    }

    run(args: string[]) {
        this.#onRun(args)
    }

    getName(): string { return this.#name }
    getOnRun(): FnRun { return this.#onRun }

    #onRun: FnRun; #name: string;
}
