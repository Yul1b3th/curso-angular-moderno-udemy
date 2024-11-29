import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-remove-svg',
  standalone: true,
  templateUrl: './remove.component.svg',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoveSVGComponent {}
