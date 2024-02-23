import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { AuthService } from '~shared/services/auth.service';

@Component({
  selector: 'app-if-session',
  templateUrl: './if-session.component.html',
  styleUrl: './if-session.component.scss',
  styles: `:host {
  height:inherit
 }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IfSessionComponent {
  private authService = inject(AuthService);
  session$ = this.authService.session$;
  @Input() notLoggedInTemplate!: TemplateRef<any>;
}
