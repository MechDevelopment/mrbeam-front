export function randInt(a: number, b: number): number {
  let rand: number = a - 0.5 + Math.random() * (b - a + 1)
  return Math.round(rand)
}

export function shuffleArray<T>(array: Array<T>): Array<T> {
  let m = array.length
  let t, i

  while (m) {
    i = Math.floor(Math.random() * m--)
    t = array[m]
    array[m] = array[i]
    array[i] = t
  }

  return array
}

export function flat(array: Array<number | number[]>): number[] {
  const result: number[] = []
  for (let i = 0; i < array.length; i++) {
    if (Array.isArray(array[i])) result.push(...(array[i] as number[]))
    else result.push(array[i] as number)
  }
  return result
}

export function solve(matrix: number[][], vector: number[]): number[] {
  // size
  const n = matrix.length

  // create SLAU
  for (let i = 0; i < n; i++) matrix[i].push(vector[i])

  // go along the diagonal elements
  for (let i = 0; i < n; i++) {
    // make diagonal equal one
    if (matrix[i][i] != 1) {
      let aii = matrix[i][i]
      for (let j = 0; j < n + 1; j++) matrix[i][j] /= aii
    }

    // change the other lines
    for (let j = 0; j < n; j++) {
      if (j == i || matrix[j][i] == 0) continue

      let aji = matrix[j][i]
      for (let k = i; k < n + 1; k++) {
        matrix[j][k] -= matrix[i][k] * aji
      }
    }
  }

  return matrix.map((element) => element[n])
}

export function multiply(matrix: number[][], vector: number[]): number[] {
  let sum: number
  let result: number[] = []
  for (let i = 0; i < matrix.length; i++) {
    sum = 0
    for (let j = 0; j < matrix[0].length; j++) {
      sum += matrix[i][j] * vector[j]
    }
    result.push(sum)
  }
  return result
}
