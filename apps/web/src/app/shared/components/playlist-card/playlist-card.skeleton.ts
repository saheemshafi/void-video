import { Component } from '@angular/core';

@Component({
  selector: 'app-playlist-card-skeleton',
  template: ` <div class="playlist-card">
    <div
      class="thumbnail-container"
      [ngStyle]="{ width: '100%', aspectRatio: '16 / 9' }"
    >
      <div class="skeleton" [ngStyle]="{ height: '100%' }"></div>
      <div
        class="playlist-total-videos skeleton"
        [ngStyle]="{ width: '41px', height: '16px' }"
      ></div>
    </div>
    <div class="playlist-card-info">
      <div
        class="playlist-card-img skeleton"
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
  </div>`,
  styleUrl: './playlist-card.component.scss',
})
export class PlaylistCardSkeleton {}
