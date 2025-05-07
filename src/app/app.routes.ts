import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { ProductsComponent } from './Components/products/products.component';
import { ProductDetailsComponent } from './Components/product-details/product-details.component';
import { CartComponent } from './Components/cart/cart.component';
import { authGuard } from './Guards/auth.guard';
import { ErrorComponent } from './Components/error/error.component';
import { RegisterComponent } from './Components/register/register.component';
import { MainLayoutComponent } from './Layouts/main-layout/main-layout.component';
import { AuthenticationLayoutComponent } from './Layouts/authentication-layout/authentication-layout.component';

/*
export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent, title: 'Home'},
    {path: 'products', component: ProductsComponent, title: 'Products'},
    {path: 'products/:id', component: ProductDetailsComponent, title: 'Product Details'},
    {path: 'cart', loadChildren:()=>import('./Components/cart/cart.component').then(c => c.CartComponent) , title: 'Cart', canActivate: [authGuard]},
    {path: 'Wishing', loadChildren: () => import('./Components/wishing-list/wishing-list.component').then(m => m.WishingListComponent), title: 'Wishing', canActivate: [authGuard] },
    {path: 'checkout', loadChildren: () => import('./Components/checkout/checkout.component').then(m => m.CheckoutComponent), title: 'Checkout', canActivate: [authGuard] },
    {path: 'login', loadComponent: () => import('./Components/login/login.component').then(m => m.LoginComponent), title: 'Login' },
    //{path: 'register', loadComponent: () => import('./Components/register/register.component').then(m => m.RegisterComponent), title: 'Register' },
    {path: 'register', component: RegisterComponent, title: 'Register' },
    {path: 'profile', loadChildren: () => import('./Components/profile/profile.component').then(m => m.ProfileComponent), title: 'Profile', canActivate: [authGuard] },
    {path: '**', component: ErrorComponent, title: 'Error' }
];
*/
export const routes: Routes = [
    {path:"",component:MainLayoutComponent,children:[
        {path: '', redirectTo: 'home', pathMatch: 'full'} ,
        {path:"home",component:HomeComponent, title: 'Home'},
        {path:"products",component:ProductsComponent, title: 'Products'},
        {path: 'products/:id', component: ProductDetailsComponent, title: 'Product Details'},
        {path: 'cart', loadComponent:()=>import('./Components/cart/cart.component').then(c => c.CartComponent) , title: 'Cart', canActivate: [authGuard]},
        {path: 'Wishing', loadComponent: () => import('./Components/wishing-list/wishing-list.component').then(m => m.WishingListComponent), title: 'Wishing', canActivate: [authGuard] },
        {path: 'checkout', loadComponent: () => import('./Components/checkout/checkout.component').then(m => m.CheckoutComponent), title: 'Checkout', canActivate: [authGuard] },
        {path: 'profile', loadComponent: () => import('./Components/profile/profile.component').then(m => m.ProfileComponent), title: 'Profile', canActivate: [authGuard] },
    ]},
    {path:"auth",component:AuthenticationLayoutComponent,children:[
        {path: 'login', loadComponent: () => import('./Components/login/login.component').then(m => m.LoginComponent), title: 'Login' },
        {path: 'register', loadComponent: () => import('./Components/register/register.component').then(m => m.RegisterComponent), title: 'Register' },
    
    ]},
    {path: '**', component: ErrorComponent, title: 'Error' }
];