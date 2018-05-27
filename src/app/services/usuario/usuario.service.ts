import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/usuario.model';
import { URL_SERVICIOS } from '../../config/config';
import { Router } from '@angular/router';
import { SubirarchivoService } from '../subir-archivo/subirarchivo.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any[] = [];

  constructor(
    public _http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirarchivoService
  ) {
    this.getStorage();
  }


  getStorage() {
    if ( localStorage.getItem('token') ) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
      
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }
  
  isLogged() {
    return ( this.token.length > 5 ) ? true : false;
  }

  setStorage( id: string, token: string, usuario: Usuario, menu: any ) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;

  }


  loginGoogle( token: string ) {
    
    let url = URL_SERVICIOS + '/login/google';

    return this._http.post( url, { token } )
      .map( (res: any) => {
        this.setStorage(res.id, res.token, res.usuario, res.menu);

        return true;
      });

  }

  logout() {
    this.usuario = null;
    this.token = '';
    this.menu = [];

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('id');
    localStorage.removeItem('menu');
    
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
        this.setStorage(res.id, res.token, res.usuario, res.menu);
        return true;
      })
      .catch( err => {

        swal('Error', err.error.mensaje, 'error');
        return Observable.throw(err);
        
      });

  }


  crearUsuario( usuario: Usuario ) {

    let url = URL_SERVICIOS + '/usuario';

    return this._http.post( url, usuario )
      .map( (res: any) => {

        swal('Usuario creado satisfactoriamente', usuario.email, 'success');
        return res.usuario;

      })
      .catch( err => {

        swal('Error', err.error.errors.message, 'error');
        return Observable.throw(err);
        
      });


  }

  actualizarUsuario( usuario: Usuario ) {

    let url = URL_SERVICIOS + '/usuario/' + usuario._id + '?token=' + this.token;

    return this._http.put( url, usuario )
      .map( (res: any) => {

        if ( usuario._id === this.usuario._id ) {
          let usuarioDB: Usuario = res.usuario;
          this.setStorage( usuarioDB._id , this.token, usuarioDB, this.menu );
        }
        
        swal('Felicidades', 'Usuario actualizado correctamente', 'success');

        return true;
        
      })
      .catch( err => {

        swal('Error', err.error.errors.message, 'error');
        return Observable.throw(err);
        
      });

  }

  cambiarImagen( file: File, id: string ) {

    this._subirArchivoService.subirArchivo( file, 'usuarios', id )
      .then( (res: any) => {
        
        this.usuario.img = res.usuario.img;
        swal('Felicidades', 'Imagen de usuario actualizada correctamente', 'success');

        this.setStorage( id, this.token, this.usuario, this.menu );


      })
      .catch( res => {
        console.log(res);
      });

  }

  cargarUsuarios( desde: number = 0 ) {

    let url = URL_SERVICIOS + '/usuario?desde=' + desde;

    return this._http.get( url );

  }

  buscarUsuarios( termino: string ) {

    let url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;

    return this._http.get( url )
      .map( (res: any) => res.usuarios);
  }


  borrarUsuario( id: string ) {
    
    let url = URL_SERVICIOS + '/usuario/' + id;
    url += '?token=' + this.token;

    return this._http.delete(url)
      .map( res => {
        swal('Usuario eliminado', 'El usuario ha sido eliminado correctamente', 'success');
        return true;
      });

  }

}
