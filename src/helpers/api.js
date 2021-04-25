import axios from "axios"

class AxiosCostume {
    #config
    #configForm

    constructor(token = "token") {
        this.#config = {
            baseURL: "https://api.musicfly.id/api",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
        this.#configForm = {
            baseURL: "https://api.musicfly.id/api",
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        }
        this.req = axios.create(this.#config)
        this.FormData = axios.create(this.#configForm)
    }

    showConfig() {
        return this.#config
    }
}

export default AxiosCostume
