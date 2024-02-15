import { Component, Input } from '@angular/core';

type GridColumns = {
  sm: number;
  md: number;
  lg: number;
  xl: number;
};

@Component({
  selector: 'app-item-grid',
  templateUrl: './item-grid.component.html',
  styleUrl: './item-grid.component.scss',
})
export class ItemGridComponent {
  @Input() columns: Partial<GridColumns> = {};

  protected readonly DEFAULT_COLUMNS: GridColumns = {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 3,
  };
}
