import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';

import { 
  SettingsService,
  SidebarService,
  SharedService,
  UsuarioService,
  SubirarchivoService,
  HospitalService,
  MedicoService,
  LoginGuardGuard,
  AdminGuard
 } from './service.index';
 

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    SettingsService,
    SidebarService,
    SharedService,
    UsuarioService,
    SubirarchivoService,
    ModalUploadService,
    HospitalService,
    MedicoService,
    LoginGuardGuard,
    AdminGuard
  ],
  declarations: []
})
export class ServiceModule { }
