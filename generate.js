const fs = require('fs')
const wallpaper = require('wallpaper')
const { registerFont, createCanvas, loadImage } = require('canvas')
registerFont('assets/fonts/YanoneKaffeesatz-Regular.otf', { family: 'Yanone Kaffeesatz' })
const canvas = createCanvas(300, 300)
const ctx = canvas.getContext('2d')
const values = [
    'Considered, but contestable.',
    'Be curious.',
    'Appreciate the craft.',
    'Do more with less.',
    'Own outcomes, not ideas.',
    'Say no, explicitly.',
    'Make others successful.',
    'Look for lessons, create teachable moments.',
    'Be present.'
]
const leadershipPrinciples = [
    'Customer obsessions.',
    'Ownership.',
    'Invent & simplify.',
    'Are right, a lot.',
    'Learn & be curious.',
    'Hire & develop the best.',
    'Insist on the highest standards.',
    'Think big.',
    'Bias for action.',
    'Frugality.',
    'Earn trust.',
    'Dive deep.',
    'Have backbone; disagree & commit.',
    'Deliver results.'
]
const phrases = values.concat(leadershipPrinciples)

const backgroundPath = 'assets/backgrounds'
const backgrounds = fs.readdirSync(backgroundPath).map(file => {
    return backgroundPath + '/' + file
})

const phrase     = phrases[Math.floor(Math.random() * phrases.length)]
const background = backgrounds[Math.floor(Math.random() * backgrounds.length)]
loadImage(background).then((image) => {
    canvas.width = image.width
    canvas.height = image.height
    ctx.drawImage(image, 0, 0)

    const textHeight = 100
    ctx.font = textHeight.toString() + 'px "Yanone Kaffeesatz"'
    var text = ctx.measureText(phrase)
    xPos = 100
    yPos = image.height - 100 - textHeight
    ctx.lineWidth = 15
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.strokeText(phrase, xPos, yPos)

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
    ctx.fillText(phrase, xPos, yPos)

    let filename = __dirname + '/assets/generated/' + Math.random().toString(36).substr(2, 5) + '.jpg'
    const out = fs.createWriteStream(filename)
    const stream = canvas.createJPEGStream({
        quality: 0.95,
        chromaSubsampling: false
    })
    stream.pipe(out)
    out.on('finish', () => {
        wallpaper.set(filename).then(() => {})
    } )
})