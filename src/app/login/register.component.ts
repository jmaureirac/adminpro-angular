import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

declare function init_plugins();

import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
const swal: SweetAlert = _swal as any;



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {

  forma: FormGroup;

  constructor(
    public router: Router,
    public _usuarioService: UsuarioService
  ) { }

  sonIguales( campo1: string, campo2: string ) {

    return ( group: FormGroup ) => {

      let pw1 = group.controls[campo1].value;
      let pw2 = group.controls[campo2].value;

      if ( pw1 === pw2) {
        return null;
      }

      return {
        sonIguales: true
      };

    };

  }

  ngOnInit() {
    init_plugins();

    this.forma = new FormGroup({
      nombre: new FormControl(null, Validators.required),
      correo: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
      password2: new FormControl(null, Validators.required),
      condiciones: new FormControl(false)
    }, { validators: this.sonIguales('password', 'password2') });

    this.forma.setValue({
      nombre: 'test',
      correo: 'test@test.com',
      password: '123456',
      password2: '123456',
      condiciones: true
    });

  }

  registrarUsuario() {

    if ( this.forma.invalid ) {
      return;
    }

    if ( !this.forma.value.condiciones ) {
      swal('Importante', 'Debe aceptar las condiciones de uso', 'warning');
      return;
    }
    
    let usuario = new Usuario(
      this.forma.value.nombre,
      this.forma.value.correo,
      this.forma.value.password,
    );

    this._usuarioService.crearUsuario( usuario )
      .subscribe( res => this.router.navigate(['/login']));

  }

}
