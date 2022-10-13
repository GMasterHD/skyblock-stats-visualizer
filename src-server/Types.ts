export type Item = {
    id?: string
    count?: number
}
export type ProgressiveSlayer = {
    xp: number,
    kills: {
        t1: number,
        t2: number,
        t3: number,
        t4: number,
        t5: number
    }
}
export type Slayer = {
    drops: Item
}

export type DungeonFloor = {
    drops: Item[]
    completions: number
    spent: number
}

export interface DungeonFloors {
    [key: string]: DungeonFloor
}

export class DungeonFloorTypes {
    static F1: string = 'F1'
    static F2: string = 'F2'
    static F3: string = 'F3'
    static F4: string = 'F4'
    static F5: string = 'F5'
    static F6: string = 'F6'
    static F7: string = 'F7'
    static M1: string = 'M1'
    static M2: string = 'M2'
    static M3: string = 'M3'
    static M4: string = 'M4'
    static M5: string = 'M5'
    static M6: string = 'M6'
    static M7: string = 'M7'
}

export class SlayerTypes {
    static ZOMBIE: string = 'zombie'
    static SPIDER: string = 'spider'
    static WOLF: string = 'wolf'
    static ENDERMAN: string = 'enderman'
    static BLAZE: string = 'blaze'
}
