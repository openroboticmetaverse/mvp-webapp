import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export class ThreeControls extends OrbitControls {

  constructor(camera: THREE.PerspectiveCamera, element: HTMLElement) {
    super(camera, element)

    this.enableDamping = true
  }
}
