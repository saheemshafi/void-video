import { Component, HostBinding, inject } from '@angular/core';

import { UiService } from '~shared/services/ui.service';

import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  animations: [
    trigger('toggleSidebar', [
      state(
        'collapsed',
        style({
          transform: 'translate3d(-100%, 0px, 0px)',
        })
      ),
      state(
        'expanded',
        style({
          transform: 'translate3d(0%, 0px, 0px)',
        })
      ),
      transition('collapsed <=> expanded', [animate('300ms ease-in-out')]),
    ]),
    trigger('resizeHost', [
      state(
        'collapsed',
        style({
          width: '0px',
          overflow: 'hidden',
        })
      ),
      state(
        'expanded',
        style({
          width: '250px',
        })
      ),
      transition('expanded => collapsed', [animate('300ms ease')], {
        delay: '250ms',
      }),
      transition('collapsed => expanded', [animate('200ms ease')], {}),
    ]),
  ],
})
export class SidebarComponent {
  private uiService = inject(UiService);
  sidebarState = this.uiService.sidebarState;

  @HostBinding('@resizeHost') get getResizeHost(): string {
    return this.sidebarState();
  }

  @HostBinding('@toggleSidebar') get getToggleSidebarHost(): string {
    return this.sidebarState();
  }

  toggleSidebar() {
    this.uiService.toggleSidebar();
  }
}
