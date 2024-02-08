import { CdkAccordionItem } from '@angular/cdk/accordion';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SecurityContext,
  ViewChild,
  inject,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-expandable-text',
  templateUrl: './expandable-text.component.html',
  styleUrl: './expandable-text.component.scss',
})
export class ExpandableTextComponent implements OnInit, OnChanges {
  @Input({ required: true }) text: string = '';
  @Input() maxLength: number = 200;
  @Input({ required: true }) id: string = '';
  @ViewChild(CdkAccordionItem) accordionItem!: CdkAccordionItem;
  private domSanitizer = inject(DomSanitizer);

  ngOnInit(): void {
    if (this.isExpandable() && this.accordionItem) {
      this.accordionItem && this.accordionItem.close();
    }
  }

  ngOnChanges() {
    if (this.isExpandable() && this.accordionItem) {
      this.accordionItem.close();
    } else if (this.accordionItem) {
      this.accordionItem.open();
    }
  }

  isExpandable() {
    return this.text.length > this.maxLength;
  }

  sanitize(value: string) {
    return this.domSanitizer.sanitize(SecurityContext.HTML, value);
  }
}
