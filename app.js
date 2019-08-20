const { clipboard, remote } = require('electron')
var g = []
var textarea = document.querySelector('textarea')
var input = document.querySelector('input')
var canvas = document.querySelector('canvas')

function getScale() {
  var scale = parseFloat(input.value)
  return isNaN(scale) ? 1 : scale
}
function update() {
  // textarea
  textarea.value = g.map(
    path => {
      let dist = 0, pos
      for (let node of path) {
        if (pos)
          dist += Math.sqrt((pos[0]-node[0])**2 + (pos[1]-node[1])**2)
        pos = node
      }
      return Math.round((getScale() * dist)/5)*5
    }
  ).join('\n')
  // textarea.value = JSON.stringify(g)

  // canvas
  canvas.width = canvas.clientWidth
  canvas.height = canvas.clientHeight
  let colors = [['#060', '#0f0'], ['#600', '#f00']]
  let nodeColors = ['#afaa', '#faaa']
  let ctx = canvas.getContext('2d');
  ctx.translate(panX, panY)

  // background
  ctx.clearRect(-5000, -5000, 10000, 10000)
  ctx.fillStyle = '#1234'
  ctx.fillRect(-5000, -5000, 10000, 10000)

  // path lines
  for (let i = 0; i < g.length; i++) {
    for (let j = 1; j < g[i].length; j++) {
      ctx.beginPath()
      ctx.strokeStyle = colors[i % colors.length][j % colors[0].length]
      ctx.moveTo(...g[i][j-1])
      ctx.lineTo(...g[i][j])
      ctx.stroke()
    }
  }

  // node circles
  ctx.lineWidth = 2
  ctx.strokeStyle = '#000'
  for (let i = 0; i < g.length; i++) {
    for (let j = 0; j < g[i].length; j++) {
      ctx.fillStyle = nodeColors[i % colors.length]
      ctx.beginPath()
      ctx.arc(...g[i][j], 5, 0, 2 * Math.PI, false)
      ctx.fill()
      ctx.stroke()
    }
  }

}

document.querySelector('#close').addEventListener('click', () => {
  let w = remote.getCurrentWindow()
  w.close()
})

var panStartX, panStartY
var panX = 0, panY = 0
canvas.addEventListener('mousedown', (e) => {
  if (e.button == 0) {
    if (g.length == 0)
      g.push([])
    g[g.length - 1].push([e.clientX - canvas.offsetLeft - panX, e.clientY - canvas.offsetTop - panY])
    update()
  } else if (e.button == 1) {
    panStartX = panX - e.clientX
    panStartY = panY - e.clientY
  }
})
canvas.addEventListener('mousemove', (e) => {
  if (e.buttons == 2) {
    // move nearest point
    let dist2 = ([x1, y1], [x2, y2]) => (x1-x2)**2 + (y1-y2)**2
    let cursor = [e.clientX - canvas.offsetLeft - panX, e.clientY - canvas.offsetTop - panY]
    let nearest = [-100,-100]
    for (let path of g)
      for (let node of path) 
        if (dist2(node, cursor) < dist2(nearest, cursor))
          nearest = node
    if (dist2(nearest, cursor) < 50**2) {
      nearest[0] = cursor[0]
      nearest[1] = cursor[1]
      update()  
    }
  } else if (e.buttons == 4) {
    panX = panStartX + e.clientX
    panY = panStartY + e.clientY
    update()
  }
})

input.addEventListener('input', update)

textarea.addEventListener('click', () => {
  clipboard.writeText(textarea.value)
})


update()
// resize canvas
window.addEventListener('resize', () => {
  canvas.width = canvas.height = 0
  update()
})

document.addEventListener("keydown", ({key, ctrlKey}) => {
  // add path
  if (key == ' ') {
    let lastPath = g[g.length - 1]
    let lastNode = lastPath[lastPath.length - 1]
    g.push([[...lastNode]])
    update()
  }
  // remove last node/path
  if (key == 'z' /*&& ctrlKey*/ && g.length > 0) {
    if (g[g.length - 1].length > 1)
      g[g.length - 1].pop()
    else
      g.pop()
    update()
  }
  // reset
  if (key == 'n' && ctrlKey) {
    g = []
    update()
  }
})
