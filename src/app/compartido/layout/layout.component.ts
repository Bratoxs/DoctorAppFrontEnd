import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompartidoService } from '../compartido.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit{

  username: string = '';

  constructor(private router: Router, private compartidoService: CompartidoService,
              private cookieService: CookieService
  ){

  }

  ngOnInit(): void {
    const usuarioSesion = this.compartidoService.obtenerSesion();
    if(usuarioSesion != null){
      this.username = usuarioSesion;
    }
  }

  cerrarSesion(){
    this.compartidoService.eliminarSesion(); // Limpia el Local Storage
    this.cookieService.delete('Authorization','/'); // Limpiar la cookie con ese nombre
    this.router.navigate(['login']);
  }
}
