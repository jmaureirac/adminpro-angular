import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform( img: string, tipo: string = 'usuario'): any {
    
    let url = URL_SERVICIOS + '/img';

    if ( !img ) {
      return url + '/usuarios/xd';
    }
    
    if ( img.indexOf('https') >= 0 ) { // imagen de google
      return img;
    }

    switch ( tipo ) {

        case 'usuario':
          url += '/usuarios/' + img;
          break;

        case 'medico':
          url += '/medicos/' + img;
          break;

        case 'hospital':
          url += '/hospitales/' + img;
          break;

        default: 
          console.log('Tipo de imagen no existe');
          url += '/xd';
    }

    return url;

  }

}
