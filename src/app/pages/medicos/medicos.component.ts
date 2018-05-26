import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/service.index';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: any[] = [];
  desde: number = 0;
  cargando: boolean = true;

  constructor(
    public _medicoService: MedicoService
  ) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this.cargando = true;
    this._medicoService.cargarMedicos( this.desde )
      .subscribe( (medicos: any) => {
        this.medicos = medicos;
        this.cargando = false; 
      });
  }


  buscarMedico( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarMedicos();
      return;
    }

    this._medicoService.buscarMedicos( termino )
      .subscribe( medicos => this.medicos = medicos );
  }


  eliminarMedico( medico: Medico ) {
  
    this._medicoService.borrarMedico(medico._id)
      .subscribe( () => this.cargarMedicos() );

  }


  actualizarDesde( cambio: number ) {

    let desde = this.desde + cambio;

    if ( desde >= this._medicoService.totalMedicos ) { 
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += cambio;
    this.cargarMedicos();

  }

}
