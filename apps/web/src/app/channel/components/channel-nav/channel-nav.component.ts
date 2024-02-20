import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { isPlatformServer } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import { Subscription, debounceTime, fromEvent } from 'rxjs';

@Component({
  selector: 'app-channel-nav',
  templateUrl: './channel-nav.component.html',
  styleUrl: './channel-nav.component.scss',
  animations: [
    trigger('onStick', [
      state('false', style({ boxShadow: '0 5px 6px rgba(134, 133, 133, 0)' })),
      state('true', style({ boxShadow: '0 5px 6px rgba(134, 133, 133, 0.1)' })),
      transition('false <=> true', [animate('200ms ease')]),
    ]),
  ],
})
export class ChannelNavComponent implements OnDestroy, AfterViewInit {
  @Input({ required: true }) username: string = '';
  private platformId = inject(PLATFORM_ID);
  isSticking: boolean = false;
  private scrollSubscription!: Subscription;
  @ViewChild('nav') nav!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    if (isPlatformServer(this.platformId) || !this.nav) return;

    this.scrollSubscription = fromEvent(window, 'scroll')
      .pipe(debounceTime(100))
      .subscribe((e) => {
        const { top } = this.nav.nativeElement.getBoundingClientRect();
        const HEADER_HEIGHT = 76;
        this.isSticking = top == HEADER_HEIGHT ? true : false;
      });
  }

  ngOnDestroy(): void {
    this.scrollSubscription?.unsubscribe();
  }
}
