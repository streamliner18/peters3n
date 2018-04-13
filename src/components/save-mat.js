export function saveLatex(mat) {
  let length = mat.length
  let ret = ''
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length; j++) {
      if (i==j) ret += `{\\color{red}${mat[i][j]}}`
      else ret += mat[i][j]
      if (j < length-1) ret += ' & '
    }
    if (i < length-1) ret += ' \\\\\n'
  }
  let tem = `\\begin{equation*}\n L = \\begin{bmatrix}\n ${ret} \n \\end{bmatrix}\n \\end{equation*}`
  return tem
}

export function saveMathematica(mat) {
  let ret = 'L = {'
  for (let i=0; i<mat.length; i++) {
    ret += '{'
    ret += mat[i].join(', ')
    ret += '}'
    if (i < mat.length-1) ret += ',\n'
  }
  ret += '}'
  return ret
}

export function saveMatlab(mat) {
  let strs = mat.map(i=>i.join(' '))
  return `L = [${strs.join(';\n')}]`
}
