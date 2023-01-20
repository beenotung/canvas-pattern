const { random, floor, min, max, sqrt, pow, exp, E, log } = Math
const win = window as any

const R = 0
const G = 1
const B = 2
const A = 3

const canvas = win.main as HTMLCanvasElement
const rect = canvas.getBoundingClientRect()

const scale = 5
const w = floor(rect.width / scale)
const h = floor(rect.height / scale)
const n = w * h

const batch = sqrt(w * h) * 100

canvas.width = w
canvas.height = h

const context = canvas.getContext('2d')!
const imageData = context.getImageData(0, 0, w, h)
const data = imageData.data
const len = w * h * 4

const state: number[][] = []

function init() {
  let i = 0
  for (let y = 0; y < h; y++) {
    state[y] = []
    for (let x = 0; x < w; x++) {
      state[y][x] = 0

      data[i + R] = 0
      data[i + G] = 0
      data[i + B] = 0
      data[i + A] = 255
      i += 4
    }
  }

  fill(floor(w / 2), floor(h / 2))
}
init()

function fill(x: number, y: number) {
  state[y][x] = 1

  let i = (y * w + x) * 4
  data[i + R] = 255
  data[i + G] = 255
  data[i + B] = 255
}

let templates = {
  '+': [
    `
010
000
000
`,
    `
000
000
010
`,
    `
000
100
000
`,
    `
000
001
000
`,
    `
100
100
100
`,

    `
001
001
001
`,
    `
111
000
000
`,
    `
000
000
111
`,
  ],
  x: [
    `
100
000
000`,
    `
000
000
100`,
    `
001
000
000`,
    `
000
000
001`,
  ],
}

let patterns = extractPatterns(templates['+'])

function extractPatterns(patterns: string[]) {
  return patterns.map(text =>
    text
      .trim()
      .split('\n')
      .flatMap((line, y, lines) =>
        line.split('').map((char, x) => ({
          dx: x - floor(line.length / 2),
          dy: y - floor(lines.length / 2),
          target: char == '0' ? 0 : char == '1' ? 1 : null,
        })),
      )
      .filter(p => !(p.dx == 0 && p.dy == 0)),
  )
}

function tick() {
  // TODO write your logic here

  let y = floor(random() * h)
  let x = floor(random() * w)

  if (state[y][x] == 1) {
    return
  }

  loop_pattern: for (let pattern of patterns) {
    for (let p of pattern) {
      let px = (p.dx + x + w) % w
      let py = (p.dy + y + h) % h
      if (state[py][px] !== p.target) {
        continue loop_pattern
      }
    }
    fill(x, y)
    break
  }
}

function loop() {
  for (let i = 0; i < batch; i++) {
    tick()
  }
  context.putImageData(imageData, 0, 0)
  requestAnimationFrame(loop)
}
requestAnimationFrame(loop)

Object.assign(win, {
  canvas,
  context,
  imageData,
  loop,
  data,
  w,
  h,
  n,
  len,
})
