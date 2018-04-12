export function createMatrix (length, init_value='0') {
  let mat = []
  for (let i = 0; i < length; i++) {
    mat.push([])
    for (let j = 0; j < length; j++) {
      mat[i].push(init_value)
    }
  }
  return mat
}

export function getIterator (mat) {
  let out_vec = []
  for (let i = 1; i <= mat.length; i++) out_vec.push(i)
  return out_vec;
}

export function setMember(mat, i, j, val) {
  i = Number(i) - 1
  j = Number(j) - 1
  mat[i][j] = val
  mat[j][i] = val
  return mat
}

function degToRad (theta) {
  return theta / 180 * Math.PI
}

export function polarOffset(r, theta, x=0, y=0) {
  return {
    x: x + r * Math.cos(degToRad(theta)),
    y: y + r * Math.sin(degToRad(theta))
  }
}

export function petersenRelPos(inner, outer, x=0, y=0) {
  let vec = []
  // Compute inner coordinates
  for (let i = 0; i < 5; i++) {
    vec.push(polarOffset(inner, (270+72*i) % 360, x, y))
  }
  for (let i = 0; i < 5; i++) {
    vec.push(polarOffset(outer, (270+72*i) % 360, x, y))
  }
  return vec
}

function mapColor (map, key) {
  let colors = ['red', 'green', 'blue', 'fuchsia', 'orange', 'cyan', 'yellow', 'black']
  if (key === '' || key === '0') return '#eee'
  if (key in map) return map[key]
  else {
    map[key] = colors[Object.keys(map).length]
    return map[key]
  }
}

export let defaultMap = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

export function edges (mat, mapping) {
  let res = []
  let colors = {}
  for (let i = 0; i < 5; i++) {
    let targ = (i+3) % 5
    let matItem = mat[mapping[i]][mapping[targ]]
    res.push([
      i, targ,
      mapColor(colors, matItem)
    ])
  }
  for (let i = 0; i < 5; i++) {
    let targ = i+5
    let matItem = mat[mapping[i]][mapping[targ]]
    res.push([
      i, targ,
      mapColor(colors, matItem)
    ])
  }
  return { res, colors }
}
