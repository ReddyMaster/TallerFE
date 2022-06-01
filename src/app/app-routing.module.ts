import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { ArtefactoComponent } from './components/artefacto/artefacto.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'cliente', component: ClienteComponent},
  { path: 'artefacto', component: ArtefactoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
