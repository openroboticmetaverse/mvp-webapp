import * as THREE from 'three'

export class ThreeRenderer extends THREE.WebGLRenderer {
  constructor(container?: HTMLCanvasElement) {
    super({ antialias: true, canvas: container })
    this.setSize(window.innerWidth, window.innerHeight)
    this.setPixelRatio(window.devicePixelRatio)
  }
}
