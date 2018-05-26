import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/service.index';
import { Usuario } from '../../models/usuario.model';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;
  
  constructor(
    public _usuarioService: UsuarioService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
    this._modalUploadService.notificacion
      .subscribe( res => this.cargarUsuarios());
  }

  cargarUsuarios() {
  
    this.cargando = true;

    this._usuarioService.cargarUsuarios( this.desde )
      .subscribe( (res: any) => {
        
        this.totalRegistros = res.total;
        this.usuarios = res.usuarios;
        this.cargando = false;
        
      });
  }

  cambiarDesde( valor: number ) {

    let desde = this.desde + valor;

    if ( desde >= this.totalRegistros ) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();

  }

  buscarUsuario( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarUsuarios();
      return true;
    }

    this._usuarioService.buscarUsuarios(termino)
      .subscribe( (usuarios: Usuario[]) => {
        
        this.usuarios = usuarios;

      });
  }

  borrarUsuario( usuario: Usuario ) {
    if ( usuario._id === this._usuarioService.usuario._id ) {
      swal('Error', 'No puede eliminarse a sí mismo', 'error');
      return;
    }

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar al usuario' + usuario.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then( borrar => {
      
      if ( borrar ) {

        this._usuarioService.borrarUsuario( usuario._id )
          .subscribe( borrado => {

            this.cargarUsuarios();


          });

      }

    });

  }

  guardarUsuario( usuario: Usuario ) {

    this._usuarioService.actualizarUsuario(usuario)
      .subscribe();

  }

  mostrarModal( id: string ) {

    this._modalUploadService.mostrarModal( 'usuarios', id );

  }

}
