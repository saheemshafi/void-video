import { Component } from '@angular/core';

@Component({
  selector: 'app-video-skeleton',
  template: `
    <div class="video-card">
      <div
        class="thumbnail-container"
        [ngStyle]="{ width: '100%', aspectRatio: '16 / 9' }"
      >
        <div class="skeleton" [ngStyle]="{ height: '100%' }"></div>
        <div
          class="video-duration skeleton"
          [ngStyle]="{ width: '41px', height: '16px' }"
        ></div>
      </div>
      <div class="video-card-info">
        <div
          class="video-card-img skeleton"
          [ngStyle]="{ borderRadius: '50%', marginTop: '8px' }"
        ></div>
        <div [ngStyle]="{ paddingTop: '8px' }">
          <div
            class="skeleton"
            [ngStyle]="{ height: '14px', width: '100%' }"
          ></div>
          <div
            class="skeleton"
            [ngStyle]="{
              height: '12px',
              marginTop: '6px',
              width: '50%'
            }"
          ></div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './video-card.component.scss',
})
export class VideoCardSkeletonComponent {}
