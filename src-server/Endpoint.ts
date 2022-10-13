type QueryParameter = {
    name: string,
    required: boolean
}

import Express from 'express'

type RequestError = { id: number; text: string; }
type GetCallbackFn = (req: Express.Request, res: Express.Response, queries: object) => RequestError | null
type PostCallbackFn = (req: Express.Request, res: Express.Response, queries: object, data: object) => RequestError | null

const ERR_MISSING_PARAM = 0x01

export default class Endpoint {
    static init(prefix: string, app: Express.Application) {
        Endpoint.#prefix = prefix
        Endpoint.#app = app
    }

    static registerGet(point: string, queryParameter: QueryParameter[], callback: GetCallbackFn) {
        Endpoint.#app.get(`${Endpoint.#prefix}${point}`, async (req: Express.Request, res: Express.Response) => {
            const reqParam: string[] = []
            res.setHeader("Content-Type", "application/json")

            queryParameter.forEach(p => {
                if(!p.required) return
                reqParam.push(p.name)
            })

            let error: boolean = false

            const rParams = Object.keys(req.query)
            reqParam.forEach(p => {
                if(!rParams.includes(p)) {
                    res.json({
                        success: false,
                        error: {
                            code: ERR_MISSING_PARAM,
                            text: `Missing Parameter '${p}'!`
                        }
                    })

                    error = true
                }
            })

            if(error) return

            const status = callback(req, res, req.query)
            if(status == null) return

            res.json({
                success: false,
                error: {
                    code: status.id,
                    text: status.text
                }
            })
        })
    }
    static registerPost(point: string, queryParameter: QueryParameter[], callback: PostCallbackFn) {
        Endpoint.#app.post(`${Endpoint.#prefix}${point}`, async (req: Express.Request, res: Express.Response) => {
            const reqParam: string[] = []
            res.setHeader('Content-Type', 'application/json')

            queryParameter.forEach(p => {
                if(!p.required) return
                reqParam.push(p.name)
            })

            let error: boolean = false
            const rParams = Object.keys(req.query)
            reqParam.forEach(p => {
                if(!rParams.includes(p)) {
                    res.json({
                        success: false,
                        error: {
                            code: ERR_MISSING_PARAM,
                            text: `Missing parameter '${p}'`
                        }
                    })
                    error = true
                }
            })

            if(error) return

            const status = callback(req, res, req.query, req.body)
            if(status == null) return

            res.json({
                success: false,
                error: {
                    code: status.id,
                    text: status.text
                }
            })
        })
    }

    static #prefix: string
    static #app: Express.Application
}
