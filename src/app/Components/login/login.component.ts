import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {RouterModule, Router } from '@angular/router';


interface userLogin{
  Email:string
  Password:string
  RememberMe:boolean
}

@Component({
  selector: 'app-login',
  imports: [FormsModule,ReactiveFormsModule,CommonModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  userlogin: userLogin={Email:"" , Password:"",RememberMe:false}
  constructor(private router:Router){

  }
  FrmValidation:FormGroup=new FormGroup({
    Email:new FormControl (this.userlogin.Email ,[Validators.required ,Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")] ),
    Password:new FormControl(this.userlogin.Password,Validators.required),
    RememberMe:new FormControl(this.userlogin.RememberMe),
 })
 onSubmit(){
  if (this.FrmValidation.valid) {
    this.userlogin = this.FrmValidation.value;
    this.router.navigate(['/home']);
    //console.log('Form submitted:', this.user);
  } else {
    Object.keys(this.FrmValidation.controls).forEach(key => {
      const control = this.FrmValidation.get(key);
      control?.markAsTouched();
    });  
 }
 }
}
