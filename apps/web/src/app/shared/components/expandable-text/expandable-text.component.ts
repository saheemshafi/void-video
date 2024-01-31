import { CdkAccordionItem } from '@angular/cdk/accordion';
import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-expandable-text',
  templateUrl: './expandable-text.component.html',
  styleUrl: './expandable-text.component.scss',
})
export class ExpandableTextComponent implements OnInit {
  @Input({ required: true }) text: string = '';
  @Input() maxLength: number = 200;
  @Input({ required: true }) id: string = '';
  @ViewChild(CdkAccordionItem) accordionItem!: CdkAccordionItem;

  ngOnInit(): void {
    console.log(this.text);
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
}
