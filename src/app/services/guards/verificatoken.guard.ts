import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class VerificatokenGuard implements CanActivate {

  constructor(
    public _usuarioService: UsuarioService,
    public router: Router
  ) {

  }

  canActivate():  Promise<boolean> | boolean {
    let token = this._usuarioService.token;
    let payload = JSON.parse( atob( token.split('.')[1] ) );
  
    let expirado = this.expirado( payload.exp );

    if ( expirado ) {
      this.router.navigate(['/login']);
      return false;
    }

    
    return this.verificaRenueva(payload.exp);
  }

  verificaRenueva( fechaExp: number ): Promise<boolean> {
    
    return new Promise( (resolve, reject) => {

      let tokenExp = new Date( fechaExp * 1000 );
      let now = new Date();

      now.setTime( now.getTime() + ( 1 * 60 * 60 * 1000 ) );
  
      if ( tokenExp.getTime() > now.getTime() ) {
        resolve(true);
      } else {
        this._usuarioService.renuevaToken()
          .subscribe( () => {
            resolve(true);
          }, () => {
            this.router.navigate(['/login']);
            reject(false);
          });
      }
      

    });

  }


  expirado( fechaExp: number ) {
    let now = new Date().getTime() / 1000; // milisegundos a segundos para compatibilidad con expiracion
    if ( fechaExp < now ) {
      return true;
    } else {
      return false;
    }


  }

}
