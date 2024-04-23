import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Medico } from '../../interfaces/medico';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MedicoService } from '../../servicios/medico.service';
import { CompartidoService } from 'src/app/compartido/compartido.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalMedicoComponent } from '../../modales/modal-medico/modal-medico.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listado-medico',
  templateUrl: './listado-medico.component.html',
  styleUrls: ['./listado-medico.component.css']
})
export class ListadoMedicoComponent implements OnInit, AfterViewInit{

  displayedColumns: string[] = [
    'apellidos',
    'nombres',
    'telefono',
    'genero',
    'nombreEspecialidad',
    'estado',
    'acciones'
  ];

  dataIncial: Medico[] = [];
  dataSource = new MatTableDataSource(this.dataIncial);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _medicoServicio: MedicoService,
    private _compartidoServicio: CompartidoService,
    private dialog: MatDialog
  ){}

  obtenerMedicos(){
    this._medicoServicio.lista().subscribe({
      next: (data) => {
        if(data.isExitoso){
          this.dataSource = new MatTableDataSource(data.resultado);
          this.dataSource.paginator = this.paginator;
        }
        else{
          this._compartidoServicio.mostrarAlerta('No se encontraron datos','Advertencia!')
        }
      },
      error: (e) => {
        this._compartidoServicio.mostrarAlerta(e.error.mensaje,'Error!');
      }
    });
  }

  nuevoMedico(){
    this.dialog
        .open(ModalMedicoComponent, { disableClose: true, width: '600px' })
        .afterClosed()
        .subscribe((resultado) => {
          if(resultado == 'true'){
            this.obtenerMedicos();
          }
        })
  }

  editarMedico(medico: Medico){
    this.dialog
        .open(ModalMedicoComponent, { disableClose: true, width: '600px', data: medico})
        .afterClosed()
        .subscribe((resultado) => {
          if(resultado === 'true'){
            this.obtenerMedicos();
          }
        });
  }

  removerMedico(medico: Medico){
    Swal.fire({
      title: 'Desea Eliminra el Medico?',
      text: medico.apellidos+ ' ' +medico.nombres,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
    }).then((resultado) => {
      if(resultado.isConfirmed){ // Si se confirma que se quiere eliminar
        this._medicoServicio.eliminar(medico.id).subscribe({
          next: (data) => {
            if(data.isExitoso){
              this._compartidoServicio.mostrarAlerta('El medico fue eliminado', 'Completo');
              this.obtenerMedicos();
            }
            else{
              this._compartidoServicio.mostrarAlerta('No se pudo eliminar el medico', 'Error!')
            }
          },
          error: (e) => {
            this._compartidoServicio.mostrarAlerta(e.error.mensaje,'Error!');
          }
        })
      }
    })
  }

  aplicarFiltroListado(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this.obtenerMedicos();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

}
