import Axios from 'axios'

type ProfileData = { name: string, id: string, members: string[] }

export default class {
    static getProfiles(key: string, uuid: string): Promise<ProfileData[]> {
        return new Promise<ProfileData[]>((resolve, reject) => {
            const data: ProfileData[] = []

            Axios.get(`https://api.hypixel.net/skyblock/profiles?key=${key}&uuid=${uuid}`).then(e => {
                const res = e.data
                if(res['success'] == false) reject(res)

                res['profiles'].forEach(p => {
                    const members = Object.keys(p['members'])

                    data.push({ name: p['cute_name'], id: p['profile_id'], members })
                })

                resolve(data)
            }).catch(e => {
                reject(e)
            })
        })
    }
}
