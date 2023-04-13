import { Elem } from "../services/element";

export interface CalculateOptions {
  count?: number
}

export interface ElemLength {
  length: number
  start: number
  end: number
}

export interface Skeleton {
  indexMatrix: number[][]
  sups: number[]
  counter: number
}

export interface Graph {
  [key: string]: Array<number> | number
}

export interface GraphArgs {
  elems: Elem[]
  localSolutions: number[][]
  localReactions: number[][]
}

export interface INode {
  x: number
  force: number
  moment: number

  support?: 'fixed' | 'simple' | 'hinge'
}
