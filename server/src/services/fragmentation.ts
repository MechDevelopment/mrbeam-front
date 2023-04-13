import { CalculateOptions, ElemLength, INode } from '../core/calculate.core'
import { Elem } from './element'

const DEFAULT_COUNT = 100
const MAX_COUNT = 200

export function fragmentation(
  elems: Array<Elem>,
  options: CalculateOptions
): Array<Elem> {
  if (!options.count) options.count = DEFAULT_COUNT
  if (options.count > MAX_COUNT) options.count = MAX_COUNT

  const elemLength: ElemLength = Elem.getLength(elems)
  const factor: number = elemLength.length / (options.count - 1)

  let count: number, newNode: INode, newElem: Elem

  for (let i = elems.length - 1; i >= 0; i--) {
    count = elems[i].distance / factor

    for (let j = 1; j < count; j++) {
      newNode = { x: elems[i].nodes[1].x - factor, force: 0, moment: 0 }

      // duplicate the element by changing the second node
      newElem = new Elem([elems[i].nodes[0], newNode])
      newElem.setDistload(elems[i].distload)
      newElem.addMaterial(elems[i].material)

      // reduce the "old" element
      elems[i].nodes[0] = newNode

      // add a new element before the "old"
      elems.splice(i, 0, newElem)
    }
  }

  return elems
}
