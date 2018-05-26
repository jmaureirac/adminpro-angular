import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';
import { SubirarchivoService } from '../subir-archivo/subirarchivo.service';
import { Usuario } from '../../models/usuario.model';
import { Hospital } from '../../models/hospital.model';

@Injectable()
export class HospitalService {
  

  totalHospitales: number;

  constructor(
    public _http: HttpClient,
    public router: Router,
    public _usuarioService: UsuarioService,
    public _subirArchivoService: SubirarchivoService
  ) {
    
  }

  cargarHospitales( desde: number = 0 ) {
    
    let url = URL_SERVICIOS + '/hospital?desde=' + desde ;

    return this._http.get(url)
      .map( (res: any) => {
        this.totalHospitales = res.total;
        return res.hospitales;
      });
  }

  obtenerHospital( id: string ) {

    let url = URL_SERVICIOS + '/hospital/' + id;

    return this._http.get( url )
      .map( (res: any) => res.hospital );

  }
  
  borrarHospital( id: string ) {

    let url = URL_SERVICIOS + '/hospital/' + id;
    url += '?token=' + this._usuarioService.token;
    
    return this._http.delete( url )
      .map( (res: any) => swal('Listo', 'Hospital eliminado correctamente', 'success') );

  }

  crearHospital( nombre: string ) {

    let url = URL_SERVICIOS + '/hospital';
    url += '?token=' + this._usuarioService.token;
    
    return this._http.post(url, { nombre })
      .map( (res: any) => res.hospital );

  }

  buscarHospital( termino: string ) {

    let url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;

    return this._http.get( url )
      .map( (res: any) => res.hospitales);

  }

  actualizarHospital( hospital: Hospital ) {
    
    let url = URL_SERVICIOS + '/hospital/' + hospital._id;
    url += '?token=' + this._usuarioService.token;   

    return this._http.put(url, hospital)
      .map( (res: any) => {
       
        swal('Listo', 'Hospital actualizado correctamente', 'success');

        return res.hospital;
      });

  }

}
