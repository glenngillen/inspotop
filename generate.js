const fs = require('fs')
const mkdirp = require('mkdirp')
const wallpaper = require('wallpaper')
const screenshot = require('screenshot-desktop')
const { registerFont, createCanvas, loadImage, Image } = require('canvas')
registerFont('assets/fonts/YanoneKaffeesatz-Regular.otf', { family: 'Yanone Kaffeesatz' })
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
    'Customer obsession.',
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
const textHeight = 100

const generatedPath = __dirname + '/assets/generated'

/**
 * By Ken Fyrstenberg Nilsen
 *
 * drawImageProp(context, image [, x, y, width, height [,offsetX, offsetY]])
 *
 * If image and context are only arguments rectangle will equal canvas
*/
function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {

    if (arguments.length === 2) {
        x = y = 0;
        w = ctx.canvas.width;
        h = ctx.canvas.height;
    }

    // default offset is center
    offsetX = typeof offsetX === "number" ? offsetX : 0.5;
    offsetY = typeof offsetY === "number" ? offsetY : 0.5;

    // keep bounds [0.0, 1.0]
    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1;
    if (offsetY > 1) offsetY = 1;

    var iw = img.width,
        ih = img.height,
        r = Math.min(w / iw, h / ih),
        nw = iw * r,   // new prop. width
        nh = ih * r,   // new prop. height
        cx, cy, cw, ch, ar = 1;

    // decide which gap to fill    
    if (nw < w) ar = w / nw;                             
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
    nw *= ar;
    nh *= ar;

    // calc source rectangle
    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    // make sure source rectangle is valid
    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    // fill image in dest. rectangle
    ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
}

screenshot.all().then((imgs) => {
    imgs.forEach((img, idx) => {
        const screen = new Image()
        screen.src = img
        loadImage(background).then((image) => {
            console.log('Creating '+screen.width+'px x '+screen.height+'px background.')
            let canvas = createCanvas(screen.width, screen.height)
            let ctx = canvas.getContext('2d')
            drawImageProp(ctx, image, 0, 0, screen.width, screen.height, 0.5, 0.5)

            ctx.font = textHeight.toString() + 'px "Yanone Kaffeesatz"'
            xPos = 100
            yPos = screen.height - textHeight
            ctx.lineWidth = 15
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)'
            ctx.strokeText(phrase, xPos, yPos)

            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
            ctx.fillText(phrase, xPos, yPos)

            mkdirp.sync(generatedPath)
            let filename = generatedPath + '/' + Math.random().toString(36).substr(2, 5) + '.jpg'
            const out = fs.createWriteStream(filename)
            const stream = canvas.createJPEGStream({
                quality: 0.95,
                chromaSubsampling: false
            })
            stream.pipe(out)
            out.on('finish', () => {
                wallpaper.set(filename, { screen: idx }).then(() => { })
            })
        })
    })
})