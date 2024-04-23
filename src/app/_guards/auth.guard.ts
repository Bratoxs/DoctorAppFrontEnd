import { CanActivateFn, Router } from '@angular/router';
import { CompartidoService } from '../compartido/compartido.service';
import { inject } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = (route, state) => {

  const compartidoService = inject(CompartidoService);
  const router = inject(Router);
  const cookieService = inject(CookieService);
  // Obtener el token almacenado en la cookie
  let token = cookieService.get('Authorization');

  const usuario = compartidoService.obtenerSesion(); // Verificar si el usuario esta conectado
  if(token && usuario){ // Usuario conectado
    token = token.replace('Bearer ',''); // Quitar la palabra Bearer del token
    const decodedToken: any = jwt_decode(token); // Decodificar el token
    const fechaExpiracion = decodedToken.exp * 1000; // Multiplicar por mil ya que viene en milisegundos
    const fechaActual = new Date().getTime();

    if(fechaExpiracion < fechaActual){ // Si la fecha de expiracion ya caduco
      router.navigate(['login']); // Redireccionar al login
      return false;
    }
    return true;
  }
  else{ // Si el usuario no esta logeado redirija al login
    router.navigate(['login']);
    return false;
  }

};
