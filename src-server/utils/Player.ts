import * as Types from '../Types.js'
import {DungeonFloors} from "../Types.js";
import FS from "fs";
import Axios from "axios";
import Chalk from "chalk";

type ProgressivePlayerData = {
    uuid: string,
    time?: number
    skills: {
        combat: number,
        mining: number,
        foraging: number,
        fishing: number,
        farming: number,
        taming: number,
        enchanting: number,
        alchemy: number
    },
    mining: {
        gemstone: number,
        mithril: number,
    },
    dungeons: {
        catacombs: number,
        mage: number,
        berserk: number,
        archer: number,
        healer: number,
        tank: number,
    },
    slayer: {
        zombie: Types.ProgressiveSlayer,
        spider: Types.ProgressiveSlayer,
        wolf: Types.ProgressiveSlayer,
        enderman: Types.ProgressiveSlayer,
        blaze: Types.ProgressiveSlayer
    },
    purse: number
}

type PlayerData = {
    uuid: string
    mining: {
        treasureChests: Types.Item[]
    },
    dungoens: {
        catacombs: {
            floors: DungeonFloors
        }
    },
    slayer: {
        zombie: Types.Slayer,
        spider: Types.Slayer,
        wolf: Types.Slayer,
        enderman: Types.Slayer,
        blaze: Types.Slayer
    }
}

export default class Player {
    constructor(uuid: string, profile: string) {
        this.file = `./data/players/${uuid}/${profile}.json`
        this.uuid = uuid
        this.profile = profile

        if(FS.existsSync(this.file)) {
            this.data = JSON.parse(FS.readFileSync(this.file, { encoding: 'utf-8' }))
        } else {
            this.data = {
                uuid: uuid,
                mining: {
                    treasureChests: []
                },
                dungoens: {
                    catacombs: {
                        floors: {
                            F1: { completions: 0, spent: 0, drops: [] },
                            F2: { completions: 0, spent: 0, drops: [] },
                            F3: { completions: 0, spent: 0, drops: [] },
                            F4: { completions: 0, spent: 0, drops: [] },
                            F5: { completions: 0, spent: 0, drops: [] },
                            F6: { completions: 0, spent: 0, drops: [] },
                            F7: { completions: 0, spent: 0, drops: [] },
                            M1: { completions: 0, spent: 0, drops: [] },
                            M2: { completions: 0, spent: 0, drops: [] },
                            M3: { completions: 0, spent: 0, drops: [] },
                            M4: { completions: 0, spent: 0, drops: [] },
                            M5: { completions: 0, spent: 0, drops: [] },
                            M6: { completions: 0, spent: 0, drops: [] },
                            M7: { completions: 0, spent: 0, drops: [] }
                        }
                    }
                },
                slayer: {
                    zombie: {
                        drops: null
                    },
                    spider: {
                        drops: null
                    },
                    wolf: {
                        drops: null
                    },
                    enderman: {
                        drops: null
                    },
                    blaze: {
                        drops: null
                    }
                }
            }
        }
        this.progressiveData = {
            uuid: uuid,
            skills: {
                combat: 0,
                mining: 0,
                foraging: 0,
                enchanting: 0,
                alchemy: 0,
                farming: 0,
                taming: 0,
                fishing: 0
            },
            mining: {
                gemstone: 0,
                mithril: 0
            },
            dungeons: {
                catacombs: 0,
                archer: 0,
                berserk: 0,
                mage: 0,
                tank: 0,
                healer: 0
            },
            slayer: {
                zombie: {
                    xp: 0,
                    kills: {
                        t1: 0,
                        t2: 0,
                        t3: 0,
                        t4: 0,
                        t5: 0
                    }
                },
                spider: {
                    xp: 0,
                    kills: {
                        t1: 0,
                        t2: 0,
                        t3: 0,
                        t4: 0,
                        t5: 0
                    }
                },
                wolf: {
                    xp: 0,
                    kills: {
                        t1: 0,
                        t2: 0,
                        t3: 0,
                        t4: 0,
                        t5: 0
                    }
                },
                enderman: {
                    xp: 0,
                    kills: {
                        t1: 0,
                        t2: 0,
                        t3: 0,
                        t4: 0,
                        t5: 0
                    }
                },
                blaze: {
                    xp: 0,
                    kills: {
                        t1: 0,
                        t2: 0,
                        t3: 0,
                        t4: 0,
                        t5: 0
                    }
                }
            },
            purse: 0
        }
    }

    save() {
        if(!FS.existsSync(this.file.substring(0, this.file.lastIndexOf('/')))) {
            FS.mkdirSync(this.file.substring(0, this.file.lastIndexOf('/')), { recursive: true })
        }
        FS.writeFileSync(this.file, JSON.stringify(this.data, null, 4), { encoding: 'utf-8' })
    }
    saveProgressive() {
        const ts = Date.now()
        const path = `./data/players/${this.uuid}/${this.profile}/`
        const file = `${path}${ts}.json`

        this.progressiveData.time = ts

        if(!FS.existsSync(path)) { FS.mkdirSync(path, { recursive: true }) }
        FS.writeFileSync(file, JSON.stringify(this.progressiveData, null, 4), { encoding: 'utf-8' })
    }

    updateFromHypixelAPI(key) {
        console.log(Chalk.gray(`Upadting stats for ${this.uuid}...`))

        console.log(Chalk.gray(`https://api.hypixel.net/skyblock/profile?key=${key}&profile=${this.profile}&uuid=${this.profile}`))
        Axios.get(`https://api.hypixel.net/skyblock/profile?key=${key}&profile=${this.profile}&uuid=${this.profile}`).then(data => {
            const member = data.data['profile']['members'][this.uuid]

            // Update skills
            this.progressiveData.skills.combat = member['experience_skill_combat']
            this.progressiveData.skills.mining = member['experience_skill_mining']
            this.progressiveData.skills.foraging = member['experience_skill_foraging']
            this.progressiveData.skills.farming = member['experience_skill_farming']
            this.progressiveData.skills.taming = member['experience_skill_taming']
            this.progressiveData.skills.enchanting = member['experience_skill_enchanting']
            this.progressiveData.skills.alchemy = member['experience_skill_alchemy']
            this.progressiveData.skills.fishing = member['experience_skill_fishing']

            // Update mining
            const mining_core = member['mining_core']
            this.progressiveData.mining.mithril = mining_core['powder_spent_mithril'] + mining_core['powder_mithril']
            this.progressiveData.mining.gemstone = mining_core['powder_spent_gemstone'] + mining_core['powder_gemstone']

            // Update dungoens
            const catacombs = member['dungeons']['dungeon_types']['catacombs']
            const classes = member['dungeons']['player_classes']
            this.progressiveData.dungeons.archer = classes['archer']['experience'] == undefined ? 0 : classes['archer']['experience']
            this.progressiveData.dungeons.mage = classes['mage']['experience'] == undefined ? 0 : classes['mage']['experience']
            this.progressiveData.dungeons.berserk = classes['berserk']['experience'] == undefined ? 0 : classes['berserk']['experience']
            this.progressiveData.dungeons.tank = classes['tank']['experience'] == undefined ? 0 : classes['tank']['experience']
            this.progressiveData.dungeons.healer = classes['healer']['experience'] == undefined ? 0 : classes['healer']['experience']

            this.progressiveData.dungeons.catacombs = catacombs['experience']

            // Update Slayers
            const slayers = member['slayer_bosses']
            this.progressiveData.slayer.zombie.xp = slayers['zombie']['xp'] == undefined ? 0 : slayers['zombie']['xp']
            this.progressiveData.slayer.zombie.kills.t1 = slayers['zombie']['boss_kills_tier_0'] == undefined ? 0 : slayers['zombie']['boss_kills_tier_0']
            this.progressiveData.slayer.zombie.kills.t2 = slayers['zombie']['boss_kills_tier_1'] == undefined ? 0 : slayers['zombie']['boss_kills_tier_1']
            this.progressiveData.slayer.zombie.kills.t3 = slayers['zombie']['boss_kills_tier_2'] == undefined ? 0 : slayers['zombie']['boss_kills_tier_2']
            this.progressiveData.slayer.zombie.kills.t4 = slayers['zombie']['boss_kills_tier_3'] == undefined ? 0 : slayers['zombie']['boss_kills_tier_3']
            this.progressiveData.slayer.zombie.kills.t5 = slayers['zombie']['boss_kills_tier_4'] == undefined ? 0 : slayers['zombie']['boss_kills_tier_4']

            this.progressiveData.slayer.spider.xp = slayers['spider']['xp'] == undefined ? 0 : slayers['spider']['xp']
            this.progressiveData.slayer.spider.kills.t1 = slayers['spider']['boss_kills_tier_0'] == undefined ? 0 : slayers['spider']['boss_kills_tier_0']
            this.progressiveData.slayer.spider.kills.t2 = slayers['spider']['boss_kills_tier_1'] == undefined ? 0 : slayers['spider']['boss_kills_tier_1']
            this.progressiveData.slayer.spider.kills.t3 = slayers['spider']['boss_kills_tier_2'] == undefined ? 0 : slayers['spider']['boss_kills_tier_2']
            this.progressiveData.slayer.spider.kills.t4 = slayers['spider']['boss_kills_tier_3'] == undefined ? 0 : slayers['spider']['boss_kills_tier_3']
            this.progressiveData.slayer.spider.kills.t5 = slayers['spider']['boss_kills_tier_4'] == undefined ? 0 : slayers['spider']['boss_kills_tier_4']

            this.progressiveData.slayer.wolf.xp = slayers['wolf']['xp'] == undefined ? 0 : slayers['wolf']['xp']
            this.progressiveData.slayer.wolf.kills.t1 = slayers['wolf']['boss_kills_tier_0'] == undefined ? 0 : slayers['wolf']['boss_kills_tier_0']
            this.progressiveData.slayer.wolf.kills.t2 = slayers['wolf']['boss_kills_tier_1'] == undefined ? 0 : slayers['wolf']['boss_kills_tier_1']
            this.progressiveData.slayer.wolf.kills.t3 = slayers['wolf']['boss_kills_tier_2'] == undefined ? 0 : slayers['wolf']['boss_kills_tier_2']
            this.progressiveData.slayer.wolf.kills.t4 = slayers['wolf']['boss_kills_tier_3'] == undefined ? 0 : slayers['wolf']['boss_kills_tier_3']
            this.progressiveData.slayer.wolf.kills.t5 = slayers['wolf']['boss_kills_tier_4'] == undefined ? 0 : slayers['wolf']['boss_kills_tier_4']

            this.progressiveData.slayer.enderman.xp = slayers['enderman']['xp'] == undefined ? 0 : slayers['enderman']['xp']
            this.progressiveData.slayer.enderman.kills.t1 = slayers['enderman']['boss_kills_tier_0'] == undefined ? 0 : slayers['enderman']['boss_kills_tier_0']
            this.progressiveData.slayer.enderman.kills.t2 = slayers['enderman']['boss_kills_tier_1'] == undefined ? 0 : slayers['enderman']['boss_kills_tier_1']
            this.progressiveData.slayer.enderman.kills.t3 = slayers['enderman']['boss_kills_tier_2'] == undefined ? 0 : slayers['enderman']['boss_kills_tier_2']
            this.progressiveData.slayer.enderman.kills.t4 = slayers['enderman']['boss_kills_tier_3'] == undefined ? 0 : slayers['enderman']['boss_kills_tier_3']
            this.progressiveData.slayer.enderman.kills.t5 = slayers['enderman']['boss_kills_tier_4'] == undefined ? 0 : slayers['enderman']['boss_kills_tier_4']

            this.progressiveData.slayer.blaze.xp = slayers['blaze']['xp'] == undefined ? 0 : slayers['blaze']['xp']
            this.progressiveData.slayer.blaze.kills.t1 = slayers['blaze']['boss_kills_tier_0'] == undefined ? 0 : slayers['blaze']['boss_kills_tier_0']
            this.progressiveData.slayer.blaze.kills.t2 = slayers['blaze']['boss_kills_tier_1'] == undefined ? 0 : slayers['blaze']['boss_kills_tier_1']
            this.progressiveData.slayer.blaze.kills.t3 = slayers['blaze']['boss_kills_tier_2'] == undefined ? 0 : slayers['blaze']['boss_kills_tier_2']
            this.progressiveData.slayer.blaze.kills.t4 = slayers['blaze']['boss_kills_tier_3'] == undefined ? 0 : slayers['blaze']['boss_kills_tier_3']
            this.progressiveData.slayer.blaze.kills.t5 = slayers['blaze']['boss_kills_tier_4'] == undefined ? 0 : slayers['blaze']['boss_kills_tier_4']

            this.saveProgressive()
            console.log(Chalk.green(`Successfully updated stats for ${this.uuid}!`))
        })
    }

    addTreasureChest(items: Types.Item[]) {
        items.forEach(i => {
            this.data.mining.treasureChests.push(i)
        })
    }
    addDungeonChest(floor: Types.DungeonFloorTypes|string, cost: number, items: Types.Item[]) {
        items.forEach(i => {
            this.data.dungoens.catacombs.floors[String(floor)].drops.push(i)
        })
        this.data.dungoens.catacombs.floors[String(floor)].spent += cost
    }
    addSlayerDrop(type: Types.SlayerTypes|string, tier: number, drops: Types.Item[]) {
        drops.forEach(i => {
            this.data.slayer[String(type)].drops.push(i)
        })
    }

    file: string
    data: PlayerData
    progressiveData: ProgressivePlayerData
    uuid: string
    profile: string
}
