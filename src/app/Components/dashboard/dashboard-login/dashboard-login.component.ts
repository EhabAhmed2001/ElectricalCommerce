import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../Service/auth.service';
interface userLogin{
  Email:string
  Password:string
  RememberMe:boolean
}
@Component({
  selector: 'app-dashboard-login',
  imports: [FormsModule,ReactiveFormsModule,CommonModule,RouterModule],
  templateUrl: './dashboard-login.component.html',
  styleUrl: './dashboard-login.component.css'
})
export class DashboardLoginComponent {
  userlogin: userLogin={Email:"" , Password:"",RememberMe:false}
  errorResponceMsg:String=""

  constructor(private router:Router,private route: ActivatedRoute,private authService:AuthService){

  }
  FrmValidation:FormGroup=new FormGroup({
    Email:new FormControl (this.userlogin.Email ,[Validators.required ,Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")] ),
    Password:new FormControl(this.userlogin.Password,Validators.required),
    RememberMe:new FormControl(this.userlogin.RememberMe),
 })
 onSubmit(){
  if (this.FrmValidation.valid) {
    this.authService.Login(this.FrmValidation.value).subscribe({
      next:(res)=>{
        console.log(res)
        this.errorResponceMsg = ""
        if(this.authService.GetUserRole()=='Admin'){
          this.router.navigate(['dashboard']);
          return;
        }
        else
          this.errorResponceMsg = 'you must be admin'
      },
      error:(res)=>{
          this.errorResponceMsg = res.error.message
      }
    })
  } else {
    Object.keys(this.FrmValidation.controls).forEach(key => {
      const control = this.FrmValidation.get(key);
      control?.markAsTouched();
    });}
  }
}
