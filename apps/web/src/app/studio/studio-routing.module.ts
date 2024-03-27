import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudioComponent } from './studio.component';

const routes: Routes = [{ path: '', component: StudioComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudioRoutingModule { }
