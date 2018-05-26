import { Component, OnInit } from '@angular/core';
import { HospitalService } from '../../services/service.index';
import { Hospital } from '../../models/hospital.model';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  desde: number = 0;
  cargando: boolean = true;

  constructor(
    public _hospitalesService: HospitalService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarHospitales();
    this._modalUploadService.notificacion
      .subscribe( () => this.cargarHospitales() );
  }

  cargarHospitales(  ) {
  
    this.cargando = true;

    this._hospitalesService.cargarHospitales( this.desde )
      .subscribe( (hospitales: any) => {
        this.hospitales = hospitales;
        this.cargando = false;
      } );
  }
  
  actualizarDesde( cambio: number ) {

    let desde = this.desde + cambio;

    if ( desde >= this._hospitalesService.totalHospitales ) { 
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += cambio;
    this.cargarHospitales();

  }

  buscarHospital( termino: string , desde ) {

    if ( termino.length <= 0 ) {
      this.cargarHospitales();
      return;
    }

    this._hospitalesService.buscarHospital( termino )
      .subscribe( hospitales => this.hospitales = hospitales );

  }

  actualizarHospital( hospital: Hospital ) {

    this._hospitalesService.actualizarHospital( hospital )
      .subscribe(); 

  }

  eliminarHospital( hospital: Hospital ) {
    
    this._hospitalesService.borrarHospital( hospital._id )
      .subscribe( () => this.cargarHospitales() );

  }

  mostrarModal( id: string ) {

    this._modalUploadService.mostrarModal( 'hospitales', id );

  }
  
  crearHospital() {

    swal({
      title: 'Crear Hospital',
      text: 'Ingresar nombre del hospital',
      content: 'input',
      icon: 'info',
      buttons: true
    }).then( (valor: string ) => {
  
      if ( !valor || valor.length === 0 ) { 
        return;
      }

      this._hospitalesService.crearHospital( valor )
        .subscribe( () => this.cargarHospitales() );

    });

  }

  actualizarImagen( hospital: Hospital ) {

    this._modalUploadService.mostrarModal( 'hospitales', hospital._id );

  }

}
