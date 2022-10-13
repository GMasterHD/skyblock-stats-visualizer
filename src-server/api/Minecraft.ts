import Axios from 'axios'

export default class {
    static getUUIDByUsername(name: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            Axios.get(`https://api.mojang.com/users/profiles/minecraft/${name.toLowerCase()}`)
                .then(d => {
                    resolve(d.data.id)
                }).catch(e => {
                    console.error(e)
                    reject(e)
                })
        })
    }
}
