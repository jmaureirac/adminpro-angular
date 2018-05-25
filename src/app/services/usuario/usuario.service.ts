import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/usuario.model';
import { URL_SERVICIOS } from '../../config/config';
import { Router } from '@angular/router';

// import 'rxjs/add/operator/map';

@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(
    public _http: HttpClient,
    public router: Router
  ) {
    this.getStorage();
  }


  getStorage() {
    if ( localStorage.getItem('token') ) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
    }
  }
  
  isLogged() {
    return ( this.token.length > 5 ) ? true : false;
  }

  setStorage( id: string, token: string, usuario: Usuario ) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;

  }


  loginGoogle( token: string ) {
    
    let url = URL_SERVICIOS + '/login/google';

    return this._http.post( url, { token } )
      .map( (res: any) => {
        this.setStorage(res.id, res.token, res.usuario);

        return true;
      });

  }

  logout() {
    this.usuario = null;
    this.token = '';

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('id');
    
    this.router.navigate(['/login']);
  }

  login( usuario: Usuario, recordar: boolean = false ) {
    
    if ( recordar ) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }


    let url = URL_SERVICIOS + '/login';

    return this._http.post( url, usuario )
      .map( (res: any) => {
        this.setStorage(res.id, res.token, res.usuario);
        
        return true;
      });

  }


  crearUsuario( usuario: Usuario ) {

    let url = URL_SERVICIOS + '/usuario';

    return this._http.post( url, usuario )
      .map( (res: any) => {

        swal('Usuario creado satisfactoriamente', usuario.email, 'success');
        return res.usuario;

      });

  }

}
