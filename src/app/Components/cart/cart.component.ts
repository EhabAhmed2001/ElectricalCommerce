import { Component, OnInit } from '@angular/core';
import { CartService } from '../../Service/cart.service';
import { CommonModule } from '@angular/common';
import { EgyptShippingService } from '../../Service/egypt-shipping.service';
import { FormsModule, PristineChangeEvent } from '@angular/forms';
import { BasketItem, CartItems, CustomerBasket, shipping } from '../../Interfaces/Cart/Cart.models';
import { RouterModule } from '@angular/router';
import { SharedServiceService } from '../../Service/shared-service.service';
import { CartWishingDataService } from '../../Service/cart-wishing-data.service';



@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css', './cart.component2.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class CartComponent implements OnInit {
  Cart: CustomerBasket = {
    id: "",
    items: []
  }
  Shipping: shipping[];
  SelectValue: number = 0;
  Subtotal: number = 0;
  Total: number = 0;
  EmptyCart: boolean = true;




  constructor(private cartService: CartService, private signal: CartWishingDataService, Shipping: EgyptShippingService, private sharedService: SharedServiceService) {
    this.Shipping = Shipping.shipping;

  }

  ngOnInit(): void {

    this.cartService.getCart().subscribe({
      next: (data) => {
        this.Cart = data,
        this.Cart.items.forEach(x => {
          this.Subtotal += x.price * x.quantity;
        });
        this.sharedService.SubTotal.next(this.Subtotal);
        if (this.Cart.items.length == 0)
          this.EmptyCart = false;
      },
      error: (error) => this.EmptyCart = false
    });

    this.Total = this.Subtotal;
    console.log(this.Cart);
    //this.signal.cartItemsCount.set(this.Cart.items.length);



  }
  UpdateTotals() {

    this.Total = Number(this.Subtotal) + Number(this.SelectValue);
    console.log(this.Total);
  }
  ClearCart() {
    this.Cart.items.forEach(element => {
      this.cartService.removeFromCart(element.id).subscribe({ next: (x) => console.log(x) });

    });
    this.Cart.items = [];
    this.recalculateTotals();
    this.signal.cartItemsCount.set(this.signal.cartItems.length);



  }
  UpdateCart(quantity: number, item: CartItems) {


    if (quantity == 0) {
      // call delete item from cart ...
      this.cartService.removeFromCart(item.id).subscribe({ next: (x) => console.log(x) });
      this.Cart.items = this.Cart.items.filter(x => x.id != item.id);

      this.recalculateTotals();

    }
    else {
      item.quantity = quantity;
      this.cartService.UpdateCart(item).subscribe({
        next: cart => {
          const index = cart.items.findIndex(x => x.id === item.id);
          if (index > -1) {
            this.Cart.items[index].quantity = quantity;
          }
          this.recalculateTotals();

        },
        error: (err) => console.error(err)
      });
    }
    this.signal.cartItemsCount.set(this.Cart.items.length);



  }
  recalculateTotals() {
    this.Subtotal = 0;
    this.Cart.items.forEach(x => {
      this.Subtotal += x.price * x.quantity;
    });
    this.sharedService.SubTotal.next(this.Subtotal);
    this.EmptyCart = !(this.Cart.items.length === 0);
    this.UpdateTotals();
  }


}
