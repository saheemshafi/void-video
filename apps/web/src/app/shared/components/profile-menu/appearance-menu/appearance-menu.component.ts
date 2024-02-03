import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';

import { Theme, ThemeService } from '~shared/services/theme.service';

@Component({
  selector: 'app-appearance-menu',
  templateUrl: './appearance-menu.component.html',
  styleUrl: './appearance-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppearanceMenuComponent {
  private themeService = inject(ThemeService);
  currentTheme$ = this.themeService.theme$;
  @ViewChild('menu', { static: true }) menu!: TemplateRef<any>;

  setTheme(event: Event): void {
    const theme = (event.target as HTMLButtonElement).dataset['theme'];
    this.themeService.setTheme(<Theme>theme);
  }
}
