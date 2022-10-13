import GradientString from 'gradient-string'
import Figlet from 'figlet'
import Chalk from 'chalk'

import HTTP, {IncomingMessage, ServerResponse} from 'http'
import HTTPS from 'https'

import DotENV from 'dotenv'
DotENV.config()
const ENV = process.env

import Express from 'express'
const server: Express.Application = Express()

import Command from './commands/Command.js'
import Commands from './commands/Commands.js'
import Endpoint from "./api/Endpoint.js";

import Axios from 'axios'

const PORT = ENV.SKYBLOCK_STATS_PORT == undefined ? 20176 : ENV.SKYBLOCK_STATS_PORT

// Initialize
Commands.init()
Endpoint.init('/', server)
server.use(Express.json())

// Register Commands
Commands.register(new Command('port', (args: string[]) => {
    console.log(`Port: ${PORT}`)

    Axios.post('http://localhost:2000/push', {
        answer: 42
    }).then(d => {
        console.log(d.data)
    })

    return true
}))

console.log(GradientString.pastel.multiline(Figlet.textSync('SkyBlock Stats Server', { font: 'Doom' })))

server.get('/push/treasure', (req: Express.Request, res: Express.Response) => {
    console.log(Chalk.gray(`Request on /push`))

    console.log(JSON.stringify(req.query))

    res.send('Test')
})

server.post('/push', (req: Express.Request, res: Express.Response) => {
    console.log(`Data: ${JSON.stringify(req.body)}`)
    res.json({success: true})
})

server.listen(PORT, () => {
    console.log(Chalk.cyanBright(`Listening on port ${PORT}...`))

    new Endpoint('key', [
        {
            name: 'key',
            required: true
        }
    ]).register((req: Express.Request, res: Express.Response) => {
        res.send(JSON.stringify({
            success: true
        }))
    })
})
