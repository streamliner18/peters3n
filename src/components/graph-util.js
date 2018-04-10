export default class Matrix {
  constructor (length, init_value='0', zeroIdx=false) {
    // Generate the matrix
    this.length = length
    this.zeroIdx = zeroIdx
    this.mat = []
    for (let i = 0; i < length; i++) {
      this.mat.push([])
      for (let j = 0; j < length; j++) {
        this.mat[i].push(init_value)
      }
    }
  }

  setMatrixMember(i, j, val) {
    i = Number(i)
    j = Number(j)
    if (!this.zeroIdx) {
      i--
      j--
    }
    this.mat[i][j] = val
    this.mat[j][i] = val
  }

  getMatrixMember(i, j) {
    i = Number(i)
    j = Number(j)
    if (!this.zeroIdx) {
      i--
      j--
    }
    return this.mat[i][j]
  }

  isEditableMember(i, j) {
    i = Number(i)
    j = Number(j)
    return i <= j
  }

  getIterator() {
    let out_vec = []
    if (this.zeroIdx) for (let i = 0; i < this.length; i++) out_vec.push(i)
    else for (let i = 1; i <= this.length; i++) out_vec.push(i)
    return out_vec;
  }
}

