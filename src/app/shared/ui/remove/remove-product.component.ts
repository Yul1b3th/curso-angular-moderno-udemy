import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { RemoveSVGComponent } from './svg/remove-svg.component';

@Component({
  selector: 'app-remove-product',
  standalone: true,
  template: `
    <app-remove-svg />
    <button (click)="onRemoveProduct()" (keydown)="onRemoveProduct()">
      <span>Remove</span>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RemoveSVGComponent],
})
export class RemoveProductComponent {
  @Output() clickRemoveProduct = new EventEmitter<void>();

  onRemoveProduct(): void {
    this.clickRemoveProduct.emit();
  }
}
