import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-template-renderer',
  template: '<ng-container #container/>',
  styles: `:host {
    height:inherit
   }`,
})
export class TemplateRendererComponent implements OnInit {
  @ViewChild('container', { static: true, read: ViewContainerRef })
  container!: TemplateRef<any>;
  @Input({ required: true }) template!: TemplateRef<any>;

  ngOnInit(): void {
    this.container?.createEmbeddedView(this.template);
  }
}
