import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService, SubirarchivoService } from '../../services/service.index';
import { ModalUploadService } from './modal-upload.service';


@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenTemp: string;
  imagenSubir: File;

  @ViewChild( 'inputFile' ) inputFile: any;

  constructor(
    public _usuarioService: UsuarioService,
    public _subirArchivoService: SubirarchivoService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
  }

  clearForm() {
    this.inputFile.nativeElement.value = '';
  }

  cerrarModal() {
    this.imagenSubir = null;
    this.imagenTemp = null;

    this._modalUploadService.ocultarModal();
  }

  seleccionImagen( archivo: File ) {
    
    if ( !archivo ) {
      this.imagenSubir = null;
      return;
    }

    if ( archivo.type.indexOf('image') < 0 ) {
      swal('Cuidado', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;

    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL( archivo );

    reader.onloadend = () => this.imagenTemp = reader.result ;
    this.clearForm();

  }

  subirImagen() {
    this._subirArchivoService.subirArchivo( this.imagenSubir, this._modalUploadService.tipo, this._modalUploadService.id )
      .then( res => {

        this._modalUploadService.notificacion.emit(res);
        this.cerrarModal();

      })
      .catch( err => {
        console.log('error enl a carga');
      });
  }

}
