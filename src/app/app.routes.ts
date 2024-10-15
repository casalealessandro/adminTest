import { provideRouter, Routes } from '@angular/router';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { AppFormListComponent } from './views/app-views/app-form-list.component';
import { FormBuilderComponent } from './views/form-builder/form-builder.component';
import { UsersComponent } from './views/users/users.component';
import { OutfitsComponent } from './views/outfits/outfits.component';
import { OutfitCategoryComponent } from './views/outfit-category/outfit-category.component';
import { OutfitProductsComponent } from './views/outfit-products/outfit-products.component';


export const routes:Routes = [
    { path: 'dashboard', component: DashboardComponent }
    
  ];
  

export const AppRoutingModule = provideRouter(routes)