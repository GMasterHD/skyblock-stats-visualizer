import Command from './Command.js'
import Chalk from 'chalk'

export default class Commands {
    static init() {
        process.stdin.setEncoding('utf-8')
        process.stdin.on('data', str => {
            Commands.#eval(String(str).trim())
        })
    }

    static register(cmd: Command) {
        this.#commands[cmd.getName()] = cmd.getOnRun()
    }

    static #eval(cmd: string) {
        console.info(Chalk.gray(`Evaluating command ${cmd}`))

        let name: string = cmd
        let argStr: string

        if(cmd.includes(' ')) {
            name = cmd.substring(0, cmd.indexOf(' '))
            argStr = cmd.substring(cmd.indexOf(' '))
        } else {
            argStr = ''
        }

        if(this.#commands[name] == undefined) {
            console.error(Chalk.red(`Command ${name} not found!`))
            return
        }
        this.#commands[name](argStr.split(' '))
    }

    static #commands = {};
}
