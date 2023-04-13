import { Unit } from './core/global.core'
import { CalculateOptions, Graph, Skeleton } from './core/calculate.core'

import { graph } from './services/graph'
import { parse } from './services/parse'
import { fragmentation } from './services/fragmentation'
import { Elem } from './services/element'
import { handleErrors } from './services/error'
import { multiply, solve } from './services/algebra'

export function buildSkeleton(elems: Array<Elem>): Skeleton {
  let counter = 0 // Общее кол-во элементов в матрице индексов
  let indexMatrix = [] // Матрица индексов
  let sups = new Set() // Запоминаем места с заделками

  let temp = []
  for (let i = 0; i < elems.length; i++) {
    for (let j = 0; j < 4; j++) {
      // definition vector building
      if (
        j == 0 &&
        ['fixed', 'simple'].includes(elems[i].nodes[0].support || '')
      )
        sups.add(counter)
      if (j == 1 && elems[i].nodes[0].support === 'fixed') sups.add(counter)
      if (
        j == 2 &&
        ['fixed', 'simple'].includes(elems[i].nodes[1].support || '')
      )
        sups.add(counter)
      if (j == 3 && elems[i].nodes[1].support === 'fixed') sups.add(counter)

      // index matrix building
      if (j == 1 && elems[i].nodes[0].support === 'hinge') counter++
      temp[j] = counter
      counter++
    }
    indexMatrix[i] = [...temp]
    counter -= 2
  }
  return {
    indexMatrix,
    sups: Array.from(sups) as number[],
    counter: counter + 2,
  }
}

export function buildGlobalM(
  elems: Array<Elem>,
  { indexMatrix, sups, counter }: Skeleton
): number[][] {
  let matrix = Array.from(Array(counter), () =>
    Array.from(Array(counter), () => 0)
  )

  for (let i = 0; i < elems.length; i++) {
    for (let j = 0; j < 4; j++) {
      for (let k = 0; k < 4; k++) {
        matrix[indexMatrix[i][j]][indexMatrix[i][k]] +=
          elems[i].localMatrix[j][k]
      }
    }
  }

  // registrate definitions:
  for (let j of sups) {
    for (let k = 0; k < counter; k++) {
      matrix[k][j] = 0
      matrix[j][k] = 0
    }
    matrix[j][j] = 1
  }

  return matrix
}

export function buildGlobalV(
  elems: Array<Elem>,
  { indexMatrix, sups, counter }: Skeleton
): number[] {
  const vector = new Array(counter).fill(0)

  let i
  for (i = 0; i < elems.length; i++) {
    vector[indexMatrix[i][0]] +=
      elems[i].distVector[0] + elems[i].nodes[0].force
    vector[indexMatrix[i][1]] +=
      elems[i].distVector[1] + elems[i].nodes[0].moment
    vector[indexMatrix[i][2]] += elems[i].distVector[2]
    vector[indexMatrix[i][3]] += elems[i].distVector[3]
  }
  i--
  vector[indexMatrix[i][2]] += elems[i].nodes[1].force
  vector[indexMatrix[i][3]] += elems[i].nodes[1].moment

  // registrate definitions:
  for (let j of sups) vector[j] = 0

  return vector
}

export default function calculate(
  units: Array<Unit>,
  options: CalculateOptions = { count: 10 }
): Graph {
  handleErrors(units)

  const elems: Array<Elem> = fragmentation(parse(units), options)

  const skeleton: Skeleton = buildSkeleton(elems)
  const GM = buildGlobalM(elems, skeleton)
  const GV = buildGlobalV(elems, skeleton)
  const solution = solve(GM, GV)

  const localSolutions = []
  const localReactions = []

  for (let i = 0; i < elems.length; i++) {
    const localSolution = skeleton.indexMatrix[i].map((el) => solution[el])
    localSolutions.push(localSolution)

    localReactions.push(
      multiply(elems[i].localMatrix, localSolution).map(
        (element, index) => element - elems[i].distVector[index]
      )
    )
  }

  return graph({ elems, localSolutions, localReactions })
}
