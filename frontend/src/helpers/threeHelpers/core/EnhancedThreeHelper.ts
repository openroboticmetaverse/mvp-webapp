import type { IThreeHelper } from '../interfaces/IThreeHelper'

export class EnhancedThreeHelper implements IThreeHelper {
  constructor(private base: IThreeHelper) {}

  public animate(): void {
    console.log('Additional functionality here.')
    this.base.animate()
    // Add additional functionality here
  }
  public add(mesh): void {
    this.base.add(mesh)
  }
}
