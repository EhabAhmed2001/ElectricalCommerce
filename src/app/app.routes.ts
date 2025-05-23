import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { ProductDetailsComponent } from './Components/product-details/product-details.component';
import { authGuard } from './Guards/auth.guard';
import { ErrorComponent } from './Components/error/error.component';
import { AboutComponent } from './Components/about/about.component';
import { ShopComponent } from './Components/shop/shop.component';
import { UserComponent } from './Layouts/user/user.component';
import { DashboardComponent } from './Layouts/dashboard/dashboard.component';
import { BrandsComponent } from './Components/dashboard/brands/brands.component';
import { CreateAdminComponent } from './Components/dashboard/create-admin/create-admin.component';
import { TypesComponent } from './Components/dashboard/types/types.component';
import { UsersComponent } from './Components/dashboard/users/users.component';
import { DashboardLoginComponent } from './Components/dashboard/dashboard-login/dashboard-login.component';
import { DashboardOrdersComponent } from './Components/dashboard/dashboard-orders/dashboard-orders.component';
import { LoginComponent } from './Components/login/login.component';
import { DashboardProductComponent } from './Components/dashboard/dashboard-product/dashboard-product.component';
import { authAdminGuard } from './Guards/auth-admin.guard';

export const routes: Routes = [
  {
    path: "",
    component: UserComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, title: 'Home' },
      { path: 'products', component: ShopComponent, title: 'Products' },
      // {path: 'filter', component: FilterComponent, title: 'Filter'},
      // {path: 'shop', component: ShopComponent, title: 'Shop'},
      { path: 'products/:id', component: ProductDetailsComponent, title: 'Product Details' },
      { path: 'about', component: AboutComponent, title: 'About' },
      { path: 'cart', loadComponent: () => import('./Components/cart/cart.component').then(c => c.CartComponent), title: 'Cart', canActivate: [authGuard] },
      { path: 'Wishing', loadComponent: () => import('./Components/wishing-list/wishing-list.component').then(m => m.WishingListComponent), title: 'Wishing', canActivate: [authGuard] },
      { path: 'checkout', loadComponent: () => import('./Components/checkout/checkout.component').then(m => m.CheckoutComponent), title: 'Checkout', canActivate: [authGuard] },
      { path: 'login', loadComponent: () => import('./Components/login/login.component').then(m => m.LoginComponent), title: 'Login' },
      { path: 'register', loadComponent: () => import('./Components/register/register.component').then(m => m.RegisterComponent), title: 'Register' },
      { path: 'profile', loadComponent: () => import('./Components/profile/profile.component').then(m => m.ProfileComponent), title: 'Profile', canActivate: [authGuard] },
      { path: 'confirmOrder', loadComponent: () => import('./Components/confirm-order/confirm-order.component').then(m => m.ConfirmOrderComponent), title: 'confirmOrder', canActivate: [authGuard] },
      { path: 'thankyou', loadComponent: () => import('./Components/thankyou/thankyou.component').then(m => m.ThankyouComponent), title: 'thanks you', canActivate: [authGuard] },
      { path: 'order/:id', loadComponent: () => import('./Components/order-detail/order-detail.component').then(m => m.OrderDetailComponent), title: 'Order', canActivate: [authGuard] },
      {path: 'cancelOrder', loadComponent: () => import('./Components/cancel-order/cancel-order.component').then(m => m.CancelOrderComponent), title: 'cancel Order', canActivate: [authGuard] },

    ]
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    children: [
      { path: "", redirectTo: "orders", pathMatch: 'full' },
     // { path: "login", component: DashboardLoginComponent, title: 'Login' },
      { path: "orders", component: DashboardOrdersComponent, title: 'All Orders' , canActivate: [authAdminGuard] },
      { path: "products", component: DashboardProductComponent, title: 'Products', canActivate: [authAdminGuard]  },
      { path: "brands", component: BrandsComponent, title: 'Brands', canActivate: [authAdminGuard]  },
      { path: "types", component: TypesComponent, title: 'Types', canActivate: [authAdminGuard]  },
      { path: "users", component: UsersComponent, title: 'Users', canActivate: [authAdminGuard]  },
      { path: "create-admin", component: CreateAdminComponent, title: 'Add Admin' , canActivate: [authAdminGuard] },
    ]
  },
  {
    path: "adminLogin",
    component: DashboardLoginComponent, 
    title:'admin login'
  },
  { path: '**', component: ErrorComponent, title: 'Error' }
];
