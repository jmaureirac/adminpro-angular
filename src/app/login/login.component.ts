import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  recuerdame: boolean = false;
  email: string;

  // auth2: any;

  constructor(
    public router: Router,
    public _usuarioService: UsuarioService
  ) { }


  ngOnInit() {
    init_plugins();

    this.email = localStorage.getItem('email') || '';
    
    this.recuerdame = (this.email.length > 0) ? true : false;

    this.attachSignin();
  }
  googleInit() {
    return new Promise((resolve, reject) => {
      gapi.load('auth2', () => {
        let auth2 = gapi.auth2.init({
          client_id: '743422880281-s8e0i8vq709fjlpu8dsv1psav29cn272.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        });
        resolve(auth2);
      });  
    });
  }

  attachSignin() {
    this.googleInit().then( (auth2: any) => {
      let element = document.getElementById('btnGoogle');
      auth2.attachClickHandler( element, {}, (googleUser) => {
        let token = googleUser.getAuthResponse().id_token;
        this._usuarioService.loginGoogle(token)
          .subscribe( () => window.location.href = '#/dashboard');   //EN CASO DE ENTRAR CON DASHBOARD BUG
          // .subscribe( () => this.router.navigate(['/dashboard']));
      });
    });
  }


  ingresar( forma: NgForm ) {

    if ( forma.invalid ) {
      return;
    }

    let usuario = new Usuario(null, forma.value.email, forma.value.password);

    this._usuarioService.login( usuario, forma.value.recuerdame )
      .subscribe( () => this.router.navigate(['/dashboard']));

  }


    // ngOnInit() {
  //   init_plugins();
  //   this.email = localStorage.getItem('email') || '';
    
  //   this.recuerdame = (this.email.length > 0) ? true : false;
  
  //   this.googleInit();
     
  // }

  // googleInit() {

  //   gapi.load('auth2', () => {
  //     this.auth2 = gapi.auth2.init({
  //       cliente_id: '743422880281-s8e0i8vq709fjlpu8dsv1psav29cn272.apps.googleusercontent.com',
  //       cookiepolicy: 'single_host_origin',
  //       scope: 'profile email'
  //     });

  //     this.attachSignin(document.getElementById('btnGoogle'));
  //   });

  // }

  // attachSignin( elementHTML ) {
  
  //   this.auth2.attachClickHanlder(elementHTML, {}, (googleUser) => {
    
  //     let profile = googleUser.getBasicProfile();
  //     console.log(profile);

  //   });

  // }

}
