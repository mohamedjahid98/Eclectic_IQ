import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlertDataComponent } from './alert-data.component';


const routes: Routes = [
  {
    path: '',
      children: [
        {path: '', component: AlertDataComponent},
        ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlertDataRoutingModule { }
