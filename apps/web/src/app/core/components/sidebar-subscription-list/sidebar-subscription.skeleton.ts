import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-subscription-skeleton',
  template: `<div
    class="skeleton"
    [ngStyle]="{
      display: 'flex',
      height: '2rem',
      padding: '0.1rem',
      marginBottom: '4px'
    }"
  >
    <div
      class="skeleton"
      [ngStyle]="{
        flexShrink: '0',
        width: '1.8rem',
        height: '1.8rem',
        borderRadius: '50%'
      }"
    ></div>
    <div
      class="skeleton"
      [ngStyle]="{
        height: '1.2rem',
        width: '100%',
        margin: 'auto 0.5rem',
        borderRadius: '4px'
      }"
    ></div>
  </div>`,
})
export class SidebarSubscriptionSkeletonComponent {}
