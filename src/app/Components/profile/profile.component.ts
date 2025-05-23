import { Component ,NgModule, OnInit} from '@angular/core';
import { ProfileService } from '../../Service/profile.service';
import { CustomerAddress, UserInfo } from '../../Interfaces/Profile/Profile.models';
import { RouterModule, Routes } from '@angular/router';  // Import RouterModule
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { last } from 'rxjs';
import { OrdersComponent } from "../orders/orders.component";

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CommonModule, OrdersComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  selectedTab:number=0
  IsupdateAddress:boolean=false

  userInfo: UserInfo={email:"",displayName:"",phoneNumber:""}
  customerAddress:CustomerAddress={street:"",city:"",country:"",  firstName:"",lastName:""}

  constructor(private profileService:ProfileService) { }
  ngOnInit(): void {
      this.selectedTab=0
      this.IsupdateAddress=false
    this.profileService.GetCustomerInfo().subscribe({
      next:(res)=>{
          this.userInfo=res;
          console.log('fff');
           console.log(this.userInfo)
      }
    })
    this.profileService.GetCustomerAddress().subscribe({
      next:(res)=>{
          this.customerAddress=res;
      }
    })
    console.log(this.userInfo)
    console.log(this.customerAddress)
  }
   FrmValidation:FormGroup=new FormGroup({
      street:new FormControl(this.customerAddress.street,Validators.required),
      city:new FormControl(this.customerAddress.city,[Validators.required,Validators.pattern("[a-zA-Z-' ]{1,49}$")]),
      country:new FormControl(this.customerAddress.country,[Validators.required ,Validators.pattern("[a-zA-Z-' ]{1,49}$")]),
      firstName:new FormControl(this.customerAddress.firstName,[Validators.required,Validators.pattern("[a-zA-Z-' ]{1,49}$")]),
      lastName:new FormControl(this.customerAddress.lastName,[Validators.required ,Validators.pattern("[a-zA-Z-' ]{1,49}$")]),

   })

   clickProfileTab(){
    this.selectedTab=0
   }
   clickOrdersTab() {
    this.selectedTab=1
   }

  onUpdate(){
    this.IsupdateAddress=true;
    this.FrmValidation.patchValue({
      street: this.customerAddress.street,
      city: this.customerAddress.city,
      country: this.customerAddress.country,
      firstName:this.customerAddress.firstName,
      lastName:this.customerAddress.lastName,
    });
  }

  onSubmitAddress(){
    if(this.FrmValidation.valid){
      this.customerAddress={
        street:this.FrmValidation.value.street ,
        city:this.FrmValidation.value.city ,
        country:this.FrmValidation.value.country,
        firstName:this.FrmValidation.value.firstName,
        lastName:this.FrmValidation.value.lastName,
      }
      this.profileService.UpdateCustomerAddress(this.FrmValidation.value).subscribe({
        next:(res)=>{
        }
      })
      this.IsupdateAddress=false;
    }
    else{
      console.log(this.FrmValidation.value)
    }
  }
  OnCancelAddress(){
    this.IsupdateAddress=false;

  }
}
