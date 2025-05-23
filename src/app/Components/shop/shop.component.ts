import { Component } from '@angular/core';
import { FilterComponent } from "../filter/filter.component";
import { ProductsComponent } from "../products/products.component";

@Component({
  selector: 'app-shop',
  imports: [FilterComponent, ProductsComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent {
}

