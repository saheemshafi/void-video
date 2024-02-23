import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

@Component({
  selector: 'app-fullscreen-info',
  templateUrl: './fullscreen-info.component.html',
  styleUrl: './fullscreen-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullscreenInfoComponent {
  @Input({ required: true }) text: string = '';
  @Input({ required: true }) iconTemplate!: TemplateRef<any>;

  @ViewChild('iconContainer', { static: true, read: ViewContainerRef })
  iconContainer!: TemplateRef<any>;

  ngOnInit() {
    this.iconContainer.createEmbeddedView(this.iconTemplate);
  }
}
