import { Unit } from './../core/global.core'

const TYPE_INCLUDE = [
  'force',
  'moment',
  'distload',
  'material',
  'fixed',
  'simple',
  'hinge',
]
const VALUE_TYPES = ['force', 'moment', 'distload', 'material']

export function handleErrors(units: Array<Unit>) {
  let countOfFixed = 0
  let countOfSimple = 0

  // Type errors
  if (!Array.isArray(units))
    throw new Error('TypeError | hint: data should be an array')

  for (let unit of units) {
    if (unit.toString() !== '[object Object]')
      throw new Error('TypeError | hint: units should be objects')

    if (!unit.hasOwnProperty('x'))
      throw new Error('TypeError | hint: units should have <x> property')
    if (!unit.hasOwnProperty('type'))
      throw new Error('TypeError | hint: units should have <type> property')

    if (
      typeof unit.x !== 'number' &&
      !Array.isArray(unit.x) &&
      Object.is(+unit.x, NaN)
    ) {
      throw new Error(
        'TypeError | hint: property <x> should be a number or an array'
      )
    }

    if (!TYPE_INCLUDE.includes(unit.type)) {
      throw new Error(
        'TypeError | hint: property <type> should have a specific value'
      )
    }

    if (VALUE_TYPES.includes(unit.type)) {
      if (!unit.hasOwnProperty('value')) {
        throw new Error(
          'TypeError | hint: some units should have <value> property'
        )
      } else {
        if (
          typeof unit.value !== 'number' &&
          !Array.isArray(unit.value) &&
          Object.is(+unit.value!, NaN)
        ) {
          throw new Error(
            'TypeError | hint: property <value> should be a number or an array'
          )
        }
      }
    }

    if (unit.type === 'fixed') countOfFixed++
    if (unit.type === 'simple') countOfSimple++
  }

  // Format errors
  if (units.length === 0 || units.length === 1)
    throw new Error('FormatError | hint: not enough units')

  if (countOfFixed === 0 && countOfSimple < 2) {
    throw new Error('FormatError | hint: units should have more supports')
  }
}
