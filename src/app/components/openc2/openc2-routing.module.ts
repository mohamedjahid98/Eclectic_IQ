import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Openc2Component } from './openc2.component';
import { AddOpenc2Component } from './add-openc2/add-openc2.component';
import { ViewOpenc2Component } from './view-openc2/view-openc2.component';


const routes: Routes = [
  {
    path: '',
    component: Openc2Component, 
  },
  {
    path: '',
    children: [{
      path: 'add', component: AddOpenc2Component,
    },
  ]
  },
  {
    path: '',
    children: [{
      path: 'view/:id', component: ViewOpenc2Component,
    },
  ]
  }
  // {
  //   path: '',
  //   children: [
  //   {
  //     path: 'view-openc2', component: ViewOpenc2Component,
  //   }]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Openc2RoutingModule { }
