import { Graph, GraphArgs } from '../core/calculate.core'

export function graph({
  elems,
  localSolutions,
  localReactions,
}: GraphArgs): Graph {
  let labels = []
  let displacement = []
  let shear = []
  let moment = []
  let slopeRadians = []
  let slopeDegrees = []

  for (let i in elems) {
    labels.push(elems[i].nodes[0].x, elems[i].nodes[1].x)
    shear.push(localReactions[i][0], -localReactions[i][2])
    moment.push(localReactions[i][1], -localReactions[i][3])

    displacement.push(localSolutions[i][0], localSolutions[i][2])
    slopeRadians.push(localSolutions[i][1], localSolutions[i][3])
    slopeDegrees.push(
      (localSolutions[i][1] * 180) / Math.PI,
      (localSolutions[i][3] * 180) / Math.PI
    )
  }

  const graph: Graph = {
    labels,
    shear,
    moment,
    displacement,
    slopeRadians,
    slopeDegrees,
  }

  return graph
}
