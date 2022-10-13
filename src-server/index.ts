import GradientString from 'gradient-string'
import Figlet from 'figlet'
import Chalk from 'chalk'

import DotENV from 'dotenv'
DotENV.config()
const ENV = process.env

const { DEBUG_API_KEY: string } = ENV

import Express from 'express'
const server: Express.Application = Express()

import Command from './commands/Command.js'
import Commands from './commands/Commands.js'
import Endpoint from "./Endpoint.js";

import Axios from 'axios'
import MinecraftAPI from "./api/Minecraft.js";
import Hypixel from "./api/Hypixel.js";
import Config from "./utils/Config.js";
import Player from "./utils/Player.js";

import * as Types from './Types.js'

const PORT: number = ENV.SKYBLOCK_STATS_PORT == undefined ? 20176 : Number(ENV.SKYBLOCK_STATS_PORT)
const DEBUG_API_KEY: string = ENV.DEBUG_API_KEY

// Initialize
Commands.init()
Endpoint.init('/', server)
Config.init()
server.use(Express.json())

// Register Commands
Commands.register(new Command('port', (args: string[]) => {
    console.log(`Port: ${PORT}`)
    return true
}))
Commands.register(new Command('post', (args: string[]) => {
    let url = args[0]
    let json = args[1]

    Axios.post(url, JSON.parse(json)).then(d => {
        console.log(`Result: ${JSON.stringify(d.data)}`)
    })

    return true
}))
Commands.register(new Command('update', (args: string[]) => {
    const cfg = Config.loadConfig()
    cfg.users.forEach(u => {
        const p = new Player(u.uuid, u.profile.id)
        p.updateFromHypixelAPI(u.key)
    })

    return true
}))
Commands.register(new Command('save', (args: string[]) => {
    const cfg = Config.loadConfig()
    cfg.users.forEach(u => {
        const p = new Player(u.uuid, u.profile.id)
        p.save()
    })

    return true
}))
// Syntax: add_user <name> <key> <profile>
Commands.register(new Command('add_user', (args: string[]) => {
    let name = args[0]
    let key = args[1]
    let profileName = args[2]

    MinecraftAPI.getUUIDByUsername(name).then(uuid => {
        Config.addUser(uuid, key, profileName)
    })

    return true
}))

MinecraftAPI.getUUIDByUsername('gmasterhd').then(uuid => {
    Hypixel.getProfiles(DEBUG_API_KEY, uuid).then(profiles => {
        console.log(profiles)
    })
})

console.log(GradientString.pastel.multiline(Figlet.textSync('SkyBlock   Stats   Server', { font: 'Doom' })))

server.get('/push/treasure', (req: Express.Request, res: Express.Response) => {
    console.log(Chalk.gray(`Request on /push`))

    console.log(JSON.stringify(req.query))

    res.send('Test')
})

server.listen(PORT, () => {
    console.log(Chalk.cyanBright(`Listening on port ${PORT}...`))

    Endpoint.registerGet('profile', [
        {
            name: 'key',
            required: true
        }
    ], (req: Express.Request, res: Express.Response, queries: object) => {
        return { id: 0x002, text: 'Internal Error Occured!' }
    })

    Endpoint.registerPost('player/dungeon_chest', [
        {
            name: 'key',
            required: true
        },
        {
            name: 'uuid',
            required: true
        },
        {
            name: 'profile',
            required: true
        }
    ], (req: Express.Request, res: Express.Response, queries: object, data: object) => {
        const key = queries['key']
        const uuid = queries['uuid']
        const profile = queries['profile']

        const floor: string = data['floor']
        const cost: number = data['cost']
        const items: Types.Item[] = []

        data['items'].forEach(i => {
            items.push({
                id: i.id,
                count: i.count
            })
        })

        const p = new Player(uuid, profile)

        console.log(items)
        p.addDungeonChest(floor, cost, items)
        p.save()

        return null
    })
})
