import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-field-error',
  templateUrl: './field-error.component.html',
  styleUrl: './field-error.component.scss',
})
export class FieldErrorComponent<T> {
  @Input({ required: true }) control!: AbstractControl<T> | null;
  @Input() fieldName: string = '';
  @Input() id: string = '';
}
