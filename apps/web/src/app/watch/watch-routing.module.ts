import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WatchComponent } from '~watch/watch.component';
import { WatchPageComponent } from '~watch/pages/watch/watch-page.component';

const routes: Routes = [
  {
    path: '',
    component: WatchComponent,
    children: [
      {
        path: ':videoId',
        component: WatchPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WatchRoutingModule {}
