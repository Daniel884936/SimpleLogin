import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UserModel } from '../../models/user.model';
import Swal from 'sweetalert2'
import {Router} from '@angular/router'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  user:UserModel;
  rememberUser = false;
  private localEmailKey = 'email';
  constructor(private authService:AuthService, private router:Router) { }

  ngOnInit() {
    this.user = new UserModel();
    const  localEmial: string = localStorage.getItem(this.localEmailKey);
    if(localEmial){
      this.user.email = localEmial;
      this.rememberUser = true;
    }
  }

  onSubmit(form: NgForm){
    if(form.invalid) return;

    Swal.fire({
      allowOutsideClick: false,
      text: 'Espere por favor...',
      icon: 'info'
    });
    Swal.showLoading();
    this.authService.login(this.user).subscribe(response=>{
      console.log(response);
      Swal.close();

      if(this.rememberUser) //save email in local storage
         localStorage.setItem(this.localEmailKey,this.user.email);

      this.router.navigateByUrl('/home');
    }, err=>{
      console.log(err.error.error.message);

      Swal.fire({
        title: 'Error al autenticar',
        text: err.error.error.message,
        icon: 'error'
      });
    })
    console.log(form);
  }
}
