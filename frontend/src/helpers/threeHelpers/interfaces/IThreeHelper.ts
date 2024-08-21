import {Object3D} from "three"

export interface IThreeHelper {
  animate: () => void
  add: (mesh) => void
  getObjectById: (id: number) => Object3D
  getObjectByUUID: (uuid: string) => Object3D
  remove: (mesh) => void
}
