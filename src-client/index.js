const Figlet = require('figlet')
const GradientString = require('gradient-string')

console.log(GradientString.pastel.multiline(Figlet.textSync('SkyBlock Stats Client', { font: 'Doom' })))
