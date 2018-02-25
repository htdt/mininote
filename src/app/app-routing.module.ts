import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from './detail/detail.component';
import { LatestComponent } from './latest/latest.component';
import { CreatorComponent } from './detail/creator/creator.component';

const routes: Routes = [
  { path: '', component: LatestComponent },
  { path: 'note/:id', component: DetailComponent },
  { path: 'add', component: CreatorComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
