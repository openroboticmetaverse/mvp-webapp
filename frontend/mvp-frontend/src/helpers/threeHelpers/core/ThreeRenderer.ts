import * as THREE from 'three'

export class ThreeRenderer extends THREE.WebGLRenderer {
  constructor(canvas?: HTMLCanvasElement) {
    super({ antialias: true, canvas: canvas })
    this.setSize(window.innerWidth, window.innerHeight)
    this.setPixelRatio(window.devicePixelRatio)
  }
}
