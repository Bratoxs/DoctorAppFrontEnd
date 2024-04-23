import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from '../../interfaces/usuario';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UsuarioService } from '../../servicios/usuario.service';
import { CompartidoService } from 'src/app/compartido/compartido.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalUsuarioComponent } from '../../modales/modal-usuario/modal-usuario.component';

@Component({
  selector: 'app-listado-usuario',
  templateUrl: './listado-usuario.component.html',
  styleUrls: ['./listado-usuario.component.css']
})
export class ListadoUsuarioComponent implements OnInit, AfterViewInit{

  displayedColumns: string[] = [
    'username',
    'apellidos',
    'nombres',
    'email',
    'rol'
  ];

  dataInicial: Usuario[] = [];
  dataSource = new MatTableDataSource(this.dataInicial);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(private _usuarioServicio: UsuarioService,
              private _compartidoService: CompartidoService,
              private dialog: MatDialog
            ){}

  obtenerUsuarios(){
    this._usuarioServicio.lista().subscribe({
      next: (data) => {
        if(data.isExitoso){
          this.dataSource = new MatTableDataSource(data.resultado); // Llenar el dataSource
          this.dataSource.paginator = this.paginacionTabla;
        }
        else{
          this._compartidoService.mostrarAlerta('No se encontraron datos','Advertencia!');
        }
      },
        error: (e) => {
          this._compartidoService.mostrarAlerta(e.error.mensaje,'Error!');
        }
    });
  }

  nuevoUsuario(){
    this.dialog
      .open(ModalUsuarioComponent, {disableClose: true, width: '600px'})
      .afterClosed()
      .subscribe((resultado) => {
        if(resultado === 'true'){
          this.obtenerUsuarios();
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
    this.obtenerUsuarios();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginacionTabla;
  }

}
