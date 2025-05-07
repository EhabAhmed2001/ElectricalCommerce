import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatchValidator } from './validationFns';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


interface userRegisteration{
  FirstName:string,
  LastName:string,
  UserName:string,
  Email:string,
  Password:string,
  ConfirmPassword:string,
  Role:string
}
@Component({
  selector: 'app-register',
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
   user:userRegisteration={FirstName:"",LastName:"",UserName:"",Email:"",Password:"",ConfirmPassword:"",Role:""};
   constructor(private router:Router){
      
   }
   FrmValidation:FormGroup=new FormGroup({
      FirstName:new FormControl(this.user.FirstName,[Validators.required,Validators.pattern("[a-zA-Z-' ]{1,49}$")]),
      LastName:new FormControl(this.user.LastName,[Validators.required ,Validators.pattern("[a-zA-Z-' ]{1,49}$")]),
      UserName:new FormControl(this.user.UserName,Validators.required),
      Email:new FormControl (this.user.Email ,[Validators.required ,Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")] ),
      Password:new FormControl(this.user.Password,Validators.required),
      ConfirmPassword:new FormControl(this.user.ConfirmPassword,Validators.required),
      Role:new FormControl(this.user.Role,Validators.required)
   },{validators:passwordMatchValidator()})

   onSubmit(){
    if (this.FrmValidation.valid) {
      this.user = this.FrmValidation.value;
      console.log(this.user)
      this.router.navigate(['/home']);
      //console.log('Form submitted:', this.user);
    } else {
      //trigger validation mesgs if not validate
      Object.keys(this.FrmValidation.controls).forEach(key => {
        const control = this.FrmValidation.get(key);
        control?.markAsTouched();
      });  
   }
  }
}
