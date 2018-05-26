import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../usuario/usuario.service';
import { Medico } from '../../models/medico.model';

@Injectable()
export class MedicoService {

  totalMedicos: number;

  constructor(
    public _http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  cargarMedicos( desde: number = 0 ) {

    let url = URL_SERVICIOS + '/medico?desde=' + desde ;

    return this._http.get(url)
      .map( (res: any) => {
        
        this.totalMedicos = res.total;
        return res.medicos;
      });

  }

  buscarMedicos( termino: string ) {

    let url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino;

    return this._http.get( url )
      .map( (res: any) => res.medicos);
  }


  borrarMedico( id: string ) {

    let url = URL_SERVICIOS + '/medico/' + id;
    url += '?token=' + this._usuarioService.token;

    return this._http.delete(url)
      .map( (res: any) => {

        swal('Listo', 'Médico borrado correctamente', 'success');

        return res;
      });
 

  }

  guardarMedico( medico: Medico ) {

    let url = URL_SERVICIOS + '/medico';

    if ( medico._id ) { // actualizar
      url += '/' + medico._id;
      url += '?token=' + this._usuarioService.token;       

      return this._http.put(url, medico)
        .map( (res: any) => {
          swal('Listo', 'Médico actualizado satisfactoriamente', 'success');        
          return res.medico;
        });


    } else { // crear

      url += '?token=' + this._usuarioService.token; 
      
      return this._http.post(url, medico)
      .map( (res: any) => {
        
        swal('Listo', 'Médico creado satisfactoriamente', 'success');        
        
        return res.medico;
      });
      
    }

  }

  cargarMedico( id: string ) {

    let url = URL_SERVICIOS + '/medico/' + id ;

    return this._http.get(url)
      .map( (res: any) => res.medico );

  }

}
