import { Component, OnInit, signal , AfterViewInit ,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { ActivatedRoute ,Router} from '@angular/router';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/enviroment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../Service/product.service';
import { Product } from '../../Interfaces/Product/Product.models';
import { CartWishingDataService } from '../../Service/cart-wishing-data.service';
import { CartService } from '../../Service/cart.service';
import { CartItems } from '../../Interfaces/Cart/Cart.models';


@Component({
  selector: 'app-product-details',
  imports: [
    RouterModule,CommonModule,
    FormsModule
  ],

  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})


export class ProductDetailsComponent  implements OnInit
{


public products: Product[] = []; // Initialize as empty array


selectedTab: 'description' | 'info' = 'description';
product:Product=
{
  id: 0,
  pictureUrl: "",
  name: "",
  price: 0,
  category: "",
  description: "",
  brand: "",
  brandId: 0,
  type: "",
  typeId: 0,
  isFavourited: false
}
cartItem: CartItems = {
  id: 0,
  productName: "",
  pictureUrl: "",
  description :  "",
  brand:  "",
  type:  "",
  price: 0,
  quantity: 0
}
counter=signal<number>(0)

minus()
{
  if(this.counter()>0){
  this.counter.update((old)=>--old)
}
}
plus()
{
  this.counter.update((old)=>++old)
}

constructor(private service:ProductService  ,private route:Router, private router: ActivatedRoute, private cartWishingService: CartWishingDataService, private cartService: CartService)
{

}
ngOnInit(): void {
  const id = Number(this.router.snapshot.paramMap.get('id'));
  if (id) {
    this.service.getProductByID(id).subscribe((data) => {
      data.pictureUrl = data.pictureUrl.replace(
        environment.apiBaseUrl.substring(0, environment.apiBaseUrl.length - 3),
        ''
      );
      this.product = data;

      // Load related products AFTER product is set
this.service.getProductsByType(this.product.typeId).subscribe((res: any) => {
  const data = res.value;

  const productsArray = Array.isArray(data.data) ? data.data : [];

  this.products = productsArray.map((product: any) => ({
    ...product,
    pictureUrl: product.pictureUrl.replace(
      environment.apiBaseUrl.substring(0, environment.apiBaseUrl.length - 3),
      ''
    )
  }));
});

  })
  }
  }


    isLoading: boolean = false;
    isButtonDisabled: boolean = false;
    buttonText: string = 'Add To Cart'

  Add() {
    // Set loading state
    this.isLoading = true;
    this.isButtonDisabled = true;
    this.buttonText = 'Adding...';

    const qty = this.counter();
    this.cartItem = {
      id: this.product.id,
      productName: this.product.name,
      pictureUrl: this.product.pictureUrl,
      description :  this.product.description,
      brand:  this.product.brand,
      type:  this.product.type,
      price: this.product.price,
      quantity: qty
    }

    this.cartService.addToCart(this.cartItem).subscribe({
      next: (response) => {
        this.cartWishingService.cartItems.set(response.items);
        this.cartWishingService.cartItemsCount.set(response.items.length);

        // Success state
        this.buttonText = '✓ Added!';
        setTimeout(() => {
          this.buttonText = 'ADD TO CART';
          this.isButtonDisabled = false;
          this.isLoading = false;
        }, 2000);
      },
      error: () => {
        // Error state
        this.buttonText = 'Try Again';
        this.isButtonDisabled = false;
        this.isLoading = false;
      }
    });
  }

  gotodetails(id:number)
  {
  this.route.navigate([`/products/${id}`]);

  }


}



