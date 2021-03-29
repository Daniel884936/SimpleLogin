import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UserModel } from '../../models/user.model';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html'
})
export class RegistroComponent implements OnInit {

  user:UserModel;
  rememberUser:boolean;
  private localEmailKey = 'email';

  constructor(private authService:AuthService, private router: Router) { }

  ngOnInit() {
    this.user  = new UserModel();
  }

  onSubmit(registerForm:NgForm){

    if(registerForm.invalid) return;

    Swal.fire({
      allowOutsideClick: false,
      text: 'Espere por favor...',
      icon: 'info'
    });
    Swal.showLoading();

    this.authService.register(this.user).subscribe(response =>{
      console.log(response);
      Swal.close();

      if(this.rememberUser)
        localStorage.setItem(this.localEmailKey, this.user.email);

      this.router.navigateByUrl('/home');
    },(err)=>{
      console.log(err.error.error.message);

      Swal.fire({
        title: 'Error al autenticar',
        text: err.error.error.message,
        icon: 'error'
      });
    })
    console.log(registerForm);
    console.log(this.user);
  }
}
