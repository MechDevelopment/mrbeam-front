import { nanoid } from 'nanoid'

import {
  GenerateComplexity,
  Unit,
  GenerateParameters,
} from './core/global.core'
import { randInt, shuffleArray } from './services/algebra'

export interface InitSettings {
  complexity: GenerateComplexity
  unitsCount: number
  beamLength: number
}

const YOUNG = {
  Aluminum: 7036041869.548,
  Steel: 20394324259.56,
  Copper: 11930679691.84,
  Magnesium: 4588722958.401,
  Lead: 1835489183.36,
}
const YOUNG_VALS = Object.values(YOUNG)

function randForce() {
  return (randInt(0, 5) * 10 + 50) * (randInt(0, 1) ? 1 : -1)
}

function randMaterial(): [number, number] {
  const size: number = randInt(10, 30) * 0.01
  if (randInt(0, 1))
    // 50% square
    return [(size * size * size * size) / 12, size * size]
  // 50% circle
  else
    return [
      (size * size * size * size * Math.PI) / 64,
      (size * size * Math.PI) / 4,
    ]
}

function initSettings(gp: GenerateParameters): InitSettings {
  if (!gp.complexity || gp.complexity === 'random') {
    const basicComplexity: GenerateComplexity[] = [
      'elementary',
      'intermediate',
      'advanced',
    ]
    gp.complexity = basicComplexity[randInt(0, 2)]
  }

  if (!gp.unitsCount || gp.unitsCount < 2) {
    gp.unitsCount = randInt(2, 6) /* else */
    if (gp.complexity === 'intermediate') gp.unitsCount = randInt(4, 8)
    if (gp.complexity === 'advanced') gp.unitsCount = randInt(6, 10)
  }

  if (!gp.beamLength || gp.beamLength == 0) {
    gp.beamLength = randInt(8, 16)
  }

  return gp as InitSettings
}

function createUnits(unitsCount: number, beamLength: number): Array<Unit> {
  const units: Array<Unit> = []

  for (let i = 0; i < unitsCount; i++) {
    units.push({
      id: nanoid(10),
      type: 'point',
      x: (beamLength / (unitsCount - 1)) * i,
    })
  }

  return units
}

function addFixed(units: Array<Unit>): void {
  if (randInt(0, 1)) units[0].type = 'fixed'
  // left position 50%
  else units[units.length - 1].type = 'fixed' // right posititon 50%
}

function addHinge(
  units: Array<Unit>,
  level: GenerateComplexity,
  simples: [number, number]
): void {
  if (level !== 'advanced') return
  if (units.length < 4) return

  if (simples[1] < simples[0]) {
    ;[simples[0], simples[1]] = [simples[1], simples[0]]
  }

  if (simples[1] - simples[0] < 2) return

  const rand = randInt(simples[0] + 1, simples[1] - 1)

  if (randInt(0, 1)) {
    // 50% chance
    units[rand].type = 'hinge'
  }
}

function addSimple(units: Array<Unit>, complexity: GenerateComplexity): void {
  const shift: number = randInt(0, Math.floor(units.length / 2) - 1)

  if (randInt(0, 1)) {
    // 50% center position
    units[shift].type = 'simple'
    units[units.length - shift - 1].type = 'simple'

    addHinge(units, complexity, [shift, units.length - shift - 1])
  } else {
    // 50% left and right positions
    if (randInt(0, 1)) {
      // 25% points together
      if (randInt(0, 1)) {
        units[shift].type = 'simple'
        units[shift + 1].type = 'simple'
      } else {
        units[units.length - shift - 1].type = 'simple'
        units[units.length - shift - 2].type = 'simple'
      }
    } else {
      // 25% one point on the edge 22
      if (randInt(0, 1)) {
        units[0].type = 'simple'
        units[units.length - shift - 1].type = 'simple'

        addHinge(units, complexity, [0, units.length - shift - 1])
      } else {
        units[shift].type = 'simple'
        units[units.length - 1].type = 'simple'

        addHinge(units, complexity, [shift, units.length - 1])
      }
    }
  }
}

function addSupport(units: Array<Unit>, complexity: GenerateComplexity): void {
  if (units.length < 3) addFixed(units)

  if (units.length > 2 && units.length < 6) {
    if (randInt(0, 2)) addSimple(units, complexity)
    // 66% simple
    else addFixed(units) // 33% fixed
  }

  if (units.length > 5) addSimple(units, complexity)
}

function addMaterial(
  units: Array<Unit>,
  beamLength: number | number[]
): boolean {
  shuffleArray(units)
  for (let i = units.length - 1; i >= 0; i--) {
    if (units[i].type === 'point') {
      units[i].type = 'material'
      units[i].x = typeof beamLength === 'number' ? [0, beamLength] : beamLength
      units[i].value = [
        YOUNG_VALS[randInt(0, YOUNG_VALS.length - 1)],
        ...randMaterial(),
      ]
      return true
    }
  }
  return false
}

function addDistload(
  units: Array<Unit>,
  beamLength: number | number[]
): boolean {
  shuffleArray(units)
  for (let i = units.length - 1; i >= 0; i--) {
    if (units[i].type === 'point') {
      units[i].type = 'distload'
      units[i].x = typeof beamLength === 'number' ? [0, beamLength] : beamLength
      units[i].value = randInt(0, 1) ? randForce() : [randForce(), randForce()]
      return true
    }
  }
  return false
}

function addAdvancedMaterial(units: Array<Unit>, beamLength: number) {
  const rand: number = randInt(0, 1)

  switch (rand) {
    case 0: // 33% 1 material
      addMaterial(units, beamLength)
      break

    case 1: // 33% 2 materials
      const center: number = units[Math.ceil(units.length / 2)].x as number
      addMaterial(units, [0, center])
      addMaterial(units, [center, beamLength])
      break

    default:
      break
  }
}

function addAdvancedDistload(
  units: Array<Unit>,
  beamLength: number,
  unitsCount: number
): boolean {
  if (randInt(0, 2)) {
    // 66% chance
    const part = beamLength / (unitsCount - 1)
    const rand = randInt(0, unitsCount - 1)

    if (randInt(0, 1)) return addDistload(units, [0, (1 + rand) * part])
    else return addDistload(units, [rand * part, beamLength])
  }

  return true
}

function finish(units: Array<Unit>): void {
  const type = randInt(0, 2)
    ? 'force' // 66% add force
    : 'moment' // 33% add moment

  for (let i = 0; i < units.length; i++) {
    if (units[i].type === 'point') {
      units[i].type = type
      units[i].value = randForce()
    }
  }
}

export default function generate(gp: GenerateParameters = {}) {
  const { complexity, unitsCount, beamLength }: InitSettings = initSettings(gp)
  const units: Array<Unit> = createUnits(unitsCount, beamLength)

  // Добавление закреплений и шарнира
  addSupport(units, complexity)

  if (complexity === 'intermediate' && unitsCount > 3) {
    // Добавление материала на всей длине балки
    if (!addMaterial(units, beamLength)) return units

    // Добавление распределнной нагрузки на всей длине балки
    if (!addDistload(units, beamLength)) return units
  }

  if (complexity === 'advanced' && unitsCount > 5) {
    // Добавление нескольких материалов или одного
    addAdvancedMaterial(units, beamLength)

    // Добавление распределнных нагрузок
    if (!addAdvancedDistload(units, beamLength, unitsCount)) return units
  }

  // Добиваем оставшиеся точки моментами и силами
  finish(units)

  return units
}
