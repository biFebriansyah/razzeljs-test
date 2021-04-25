class Logs {
    #config
    #show
    #ondev

    constructor(showLogs, nameFile = "fileName") {
        this.#config = nameFile
        this.#show = showLogs
        this.#ondev = false
    }

    Show(msg) {
        if (this.#show && this.#ondev) {
            console.log(this.#config, msg)
        }
    }
}

export default Logs
