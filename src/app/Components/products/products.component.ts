import { Component, EventEmitter, NgModule, OnInit, Output, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Product } from '../../Interfaces/Product/Product.models';
import { ProductService } from '../../Service/product.service';
import { environment } from '../../../environments/enviroment';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../../Service/filter.service';
import { Subscription } from 'rxjs';
import { CartWishingDataService } from '../../Service/cart-wishing-data.service';
import { WishingListItems } from '../../Interfaces/Cart/Cart.models';
import { WishinglistService } from '../../Service/wishinglist.service';
import { AuthService } from '../../Service/auth.service';
import { CartService } from '../../Service/cart.service';
import { CartItems } from '../../Interfaces/Cart/Cart.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  public products: Product[] = [];
  public currentPage = 1;
  public itemsPerPage = 9;
  public totalItems = 0;
  public totalPages = 0;
  public qnty: number = 1;
  public wishingListItems: WishingListItems =
  {
    id: 0,
    productName: "",
    pictureUrl: "",
    description : "",
    brand: "",
    type: "",
    price: 0
  }
  public wishingList: WishingListItems[] =[];

    // Loading state
  public isLoading = false;

  private filterParams: {
    typeId?: number | null,
    brandId?: number | any,
    price?: number | any
  } = {};

  private filterSubscription: Subscription | null = null;

  constructor(
    private productService: ProductService,
    private filterService: FilterService,
    private wishingService: WishinglistService,
    private Auth: AuthService,
    private cartService:CartService,
    private cartWishingService:CartWishingDataService
  ) {}

  ngOnInit(): void {
    this.filterSubscription = this.filterService.getFilterObservable().subscribe(
      (params) => {
        this.filterParams = params;
        this.currentPage = 1;
        this.loadProducts();
      }
    );
    if(this.Auth.isLoggedIn())
    {
        this.wishingService.getWishinglist().subscribe({
        next: (response) =>
        {
          this.wishingList = response.items;
        }
      })
    }
  }

  ngOnDestroy(): void {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
  }

  loadProducts(): void {
    this.isLoading = true;

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
          )
        }));

        this.totalItems = totalCount;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      },
        complete: () => {
          this.isLoading = false;
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

  isInWishLit(product: Product) : boolean
  {
    return this.wishingList.some(item => item.id === product.id);
  }

  addProductToCart(p:Product){
    const item: CartItems={
      id: p.id,
      productName: p.name,
      pictureUrl: p.pictureUrl,
      description : p.description,
      brand: p.brand,
      type: p.type,
      price: p.price,
      quantity: 1
    }
    this.cartService.addToCart(item).subscribe({
      next:(response)=>{
        this.cartWishingService.cartItems.set(response.items);
        this.cartWishingService.cartItemsCount.set(response.items.length);
      }
    })
  }
  toggleWishlist(product: Product) {
    this.wishingListItems = {
      pictureUrl: product.pictureUrl,
      brand: product.brand,
      description: product.description,
      id: product.id,
      price: product.price,
      productName: product.name,
      type: product.type
    }

    if(this.isInWishLit(product))
    {
      this.wishingService.removeFromWishingList(this.wishingListItems.id).subscribe({
        next: () => {
          // Directly update the signal (if using local state)
          this.cartWishingService.wishingItems.update(items =>
            items.filter(item => item.id !== this.wishingListItems.id)
          );
          this.cartWishingService.wishlistItemsCount.update(count => count - 1);
          this.wishingList = this.wishingList.filter(item => item.id !== product.id);
        }});
    }
    else
    {
      this.wishingService.addToWishingList(this.wishingListItems).subscribe({
        next: (response) => {
          this.cartWishingService.wishingItems.set(response.items)
          this.cartWishingService.wishlistItemsCount.set(response.items.length)
          this.wishingList = response.items;
        }});
    }
  }
}
