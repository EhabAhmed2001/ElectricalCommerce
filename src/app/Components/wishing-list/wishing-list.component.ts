import { Component } from '@angular/core';
import { WishinglistService } from '../../Service/wishinglist.service';
import { WishingListItems } from '../../Interfaces/Cart/Cart.models';
import { RouterModule } from '@angular/router';
import { CartWishingDataService } from '../../Service/cart-wishing-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wishing-list',
  imports: [RouterModule, CommonModule],
  templateUrl: './wishing-list.component.html',
  styleUrl: './wishing-list.component.css'
})
export class WishingListComponent {

  // wishingListItems: WishingListItems[] = [];
  constructor(public wishingList:CartWishingDataService,private wishingService: WishinglistService ) { }


  //   ngOnInit() {
  //   this.wishingList.wishingItems.subscribe((items: WishingListItems[]) => {
  //     this.wishingListItems = items;
  //   });
  // }



  removeFromWishingList(id:number){
    this.wishingService.removeFromWishingList(id).subscribe(() => {
      // this.wishingListItems = this.wishingListItems.filter(item => item.id !== id);
      this.wishingList.wishingItems.set(this.wishingList.wishingItems().filter(item => item.id !== id));
      this.wishingList.wishlistItemsCount.set(this.wishingList.wishingItems().length);
    });
  }

}
