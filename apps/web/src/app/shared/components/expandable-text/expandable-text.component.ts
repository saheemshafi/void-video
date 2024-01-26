import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-expandable-text',
  templateUrl: './expandable-text.component.html',
  styleUrl: './expandable-text.component.scss',
})
export class ExpandableTextComponent implements OnInit {
  @Input({ required: true }) text: string = '';
  @Input() maxLength: number = 200;
  @Input({ required: true }) id: string = '';

  collapsedText: string = '';
  canExpand: boolean = false;

  ngOnInit(): void {
    if (this.text.length > this.maxLength) {
      this.canExpand = true;
      this.collapsedText = this.text.slice(0, this.maxLength);
    }
  }
}
