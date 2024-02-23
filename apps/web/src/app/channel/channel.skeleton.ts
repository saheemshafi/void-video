import { Component } from '@angular/core';

@Component({
  selector: 'app-channel-skeleton',
  template: `<section>
    <figure class="banner"></figure>
    <div class="channel-details">
      <div
        class="skeleton"
        [ngStyle]="{ width: '76px', height: '76px', borderRadius: '50%' }"
      ></div>
      <div class="channel-meta">
        <div class="skeleton" [ngStyle]="{ height: '31px' }"></div>
        <div
          class="skeleton"
          [ngStyle]="{ height: '18px', maxWidth: '100px', marginTop: '8px' }"
        ></div>
      </div>
      <div class="channel-stats">
        <div
          class="skeleton"
          [ngStyle]="{
            width: '100%',
            maxWidth: '100px',
            height: '1rem',
            marginTop: '1rem'
          }"
        ></div>
        <div
          class="skeleton"
          [ngStyle]="{
            maxWidth: '140px',
            width: '100%',
            height: '40px'
          }"
        ></div>
      </div>
    </div>
  </section>`,
  styleUrl: './channel.component.scss',
})
export class ChannelSkeletonComponent {}
