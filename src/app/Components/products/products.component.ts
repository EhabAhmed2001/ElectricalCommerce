import { Component, EventEmitter, NgModule, OnInit, Output, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Product } from '../../Interfaces/Product/Product.models';
import { ProductService } from '../../Service/product.service';
import { environment } from '../../../environments/enviroment';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../../Service/filter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  public products: Product[] = [];
  public currentPage = 1;
  public itemsPerPage = 9;
  public totalItems = 0;
  public totalPages = 0;
  
  private filterParams: {
    typeId?: number | null,
    brandId?: number | any,
    price?: number | any
  } = {};

  private filterSubscription: Subscription | null = null;

  constructor(
    private productService: ProductService, 
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.filterSubscription = this.filterService.getFilterObservable().subscribe(
      (params) => {
        this.filterParams = params;
        this.currentPage = 1;
        this.loadProducts();
      }
    );
    this.loadProducts();
  }

  ngOnDestroy(): void {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
  }

  loadProducts(): void {
    this.productService.getProducts(
      this.currentPage, 
      this.itemsPerPage, 
      this.filterParams.typeId,
      this.filterParams.brandId,
      this.filterParams.price
    ).subscribe({
      next: (response: any) => {
        // التعديل الرئيسي هنا - استخدام response.data مباشرة أو response.value.data إذا كانت موجودة
        const productsData = response.value?.data || response.data || [];
        const totalCount = response.value?.count || response.count || 0;

        this.products = productsData.map((p: Product) => ({
          ...p,
          pictureUrl: p.pictureUrl.replace(
            environment.apiBaseUrl.substring(0, environment.apiBaseUrl.length-3),
            ''
          ),
          isFavourited: localStorage.getItem(`fav_${p.id}`) === 'true'
        }));
        
        this.totalItems = totalCount;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  getPages(): number[] {
    const pagesToShow = 5;
    const pages: number[] = [];
    let startPage = Math.max(1, this.currentPage - Math.floor(pagesToShow / 2));
    let endPage = startPage + pagesToShow - 1;
    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(1, endPage - pagesToShow + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  toggleWishlist(product: Product) {
    product.isFavourited = !product.isFavourited;
    localStorage.setItem(`fav_${product.id}`, String(product.isFavourited));
    if(product.isFavourited) {
      this.productService.addProductToWishList(product);
    } else {
      this.productService.removeProductFromWishList(product.id);
    }
  }
}