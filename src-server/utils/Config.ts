import FS from 'fs'
import Hypixel from "../api/Hypixel.js";
import Chalk from "chalk";

type ConfigProfileData = {
    name: string
    id: string
}
type ConfigUserData = {
    profile: ConfigProfileData
    uuid: string
    key: string
}
type ConfigData = {
    users: ConfigUserData[]
    profiles: ConfigProfileData[]
}

export default class Config {
    static init() {
        if(!FS.existsSync('./config.json')) {
            const cfg: ConfigData = {
                users: [],
                profiles: []
            }
            this.saveConfig(cfg)
        }
    }

    static loadConfig(): ConfigData {
        return JSON.parse(FS.readFileSync('./config.json', { encoding: 'utf-8' }))
    }
    static saveConfig(cfg: ConfigData) {
        FS.writeFileSync('./config.json', JSON.stringify(cfg, null, 4), { encoding: 'utf-8' })
    }

    static addUser(uuid: string, key: string, profile: string) {
        console.log(Chalk.gray(`Adding user ${uuid}...`))

        const cfg = Config.loadConfig()
        cfg.users.forEach((u, i) => {
            if(u.uuid != uuid) return
            console.log(Chalk.yellow('Overwriting existing user...'))
            cfg.users.splice(i, 1)
        })

        Hypixel.getProfiles(key, uuid).then(profiles => {
            profiles.forEach(p => {
                if(p.name == profile) {
                    cfg.users.push({
                        uuid: uuid,
                        key: key,
                        profile: {
                            name: p.name,
                            id: p.id
                        }
                    })

                    let found = false
                    cfg.profiles.forEach(pr => {
                        if(pr.id == p.id) found = true
                    })

                    if(!found) {
                        console.log(Chalk.gray(`Adding profile ${profile} (${p.id})...`))
                        cfg.profiles.push({
                            name: p.name,
                            id: p.id
                        })
                    }

                    Config.saveConfig(cfg)
                }
            })
        })
    }
}
