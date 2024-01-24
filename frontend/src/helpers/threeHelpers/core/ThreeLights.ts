import { DirectionalLight, AmbientLight, Light } from 'three'


export class ThreeLights extends Array<Light>{
  constructor() {
    super();
    this.push(new DirectionalLight(0xffeeff, 0.8));
    this[0].position.set(1, 1, 1);

    this.push(new DirectionalLight(0xffffff, 0.8));
    this[1].position.set(-1, 0.5, -1);

    this.push(new AmbientLight(0xffffee, 0.25));

  }
}
