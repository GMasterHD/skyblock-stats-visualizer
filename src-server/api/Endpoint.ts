type QueryParameter = {
    name: string,
    required: boolean
}

type CallbackFn = (req: Express.Request, res: Express.Response) => void

import Express from 'express'

const ERR_MISSING_PARAM = 0x01

export default class Endpoint {
    static init(prefix: string, app: Express.Application) {
        Endpoint.#prefix = prefix
        Endpoint.#app = app
    }

    constructor(point: string, queryParameter: QueryParameter[]) {
        this.#queryParams = queryParameter
        this.#point = point
    }

    register(callback: CallbackFn) {
        Endpoint.#app.get(`${Endpoint.#prefix}${this.#point}`, (req: Express.Request, res: Express.Response) => {
            const reqParam: string[] = []

            res.setHeader("Content-Type", "application/json")

            this.#queryParams.forEach(p => {
                if(!p.required) return
                reqParam.push(p.name)
            })

            const rParams = Object.keys(req.query)
            reqParam.forEach(p => {
                if(!rParams.includes(p)) {
                    res.send(JSON.stringify({
                        success: false,
                        error: {
                            code: ERR_MISSING_PARAM,
                            text: `Missing Parameter ${p}!`
                        }
                    }))

                    return
                }
            })

            callback(req, res)
        })
    }

    #point: string
    #queryParams: QueryParameter[]
    static #prefix: string
    static #app: Express.Application
}
