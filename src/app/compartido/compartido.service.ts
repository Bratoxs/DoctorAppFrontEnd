import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sesion } from '../usuario/interfaces/sesion';

@Injectable({
  providedIn: 'root'
})
export class CompartidoService {

  constructor(private _snackBar: MatSnackBar) { }

  mostrarAlerta(mensaje: string, tipo: string){
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    })
  }

  // Guarda solo el usuario en el Local Storage
  guardarSesion(sesion: Sesion){
    localStorage.setItem("usuarioSesion", JSON.stringify(sesion.username));
  }

  // Obtiene la sesion del Local Storage
  obtenerSesion(){
    const sesionString = localStorage.getItem("usuarioSesion");
    const usuarioSesion = JSON.parse(sesionString!);
    return usuarioSesion;
  }

  // Eliminar el Local Storage
  eliminarSesion(){
    localStorage.removeItem("usuarioSesion");
  }
}
