import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/shared/models/cliente.model';
import { ClienteService } from 'src/app/shared/services/cliente.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  titulo: string = '';
  clientes = [new Cliente()];
  filtro: any;
  frmCliente: FormGroup;
  constructor(
    private srvCliente: ClienteService,
    private fb: FormBuilder
  ) {
    this.frmCliente = this.fb.group({
      id: [''],
      idCliente: [''],
      nombre: [''],
      apellido1: [''],
      apellido2: [''],
      telefono: [''],
      celular: [''],
      correo: [''],
      direccion: ['']
    });
  }

  //Eventos botones principales
  onNuevo() {
    this.titulo = 'Nuevo Cliente'
    this.frmCliente.reset();
  }
  onEditar(id: any) {

    this.titulo = 'Modificar Cliente';
    this.srvCliente.buscar(id)
      .subscribe({
        next: (data) => {
        //  console.log(data);
          delete data.fechaIngreso;
          this.frmCliente.setValue(data);
        }
      })
  }

  onEliminar(id: any, nombre: string) {
    Swal.fire({
      title: 'Eliminar cliente ${id}',
      text: "¡Esta acción es irreversible!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvCliente.eliminar(id)
          .subscribe({
            complete: () => {
              this.filtrar();
              Swal.fire(
                'Eliminado',
                '',
                'success'
              )
            },
            error: (error) => {
              switch (error) {
                case 404:
                  Swal.fire({
                    title: 'Id Cliente no encontrado',
                    icon: 'error',
                    showCancelButton: true,
                    showConfirmButton: false,
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Cerrar'
                  });
                  break;
                case 412:
                  Swal.fire({
                    title: 'No se puede eliminar',
                    text: 'El cliente tiene un artefacto relacionado',
                    icon: 'info',
                    showCancelButton: true,
                    showConfirmButton: false,
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Cerrar'
                  });
                  break;
              }
            }
          })
      }
    })
  }
  onGuardar() {
    //console.log(this.frmCliente.value);
    let llamada: Observable<any>;
    let texto: string = '';
    const datos = new Cliente(this.frmCliente.value);
    if (datos.id) {
      const id = datos.id;
      delete datos.id;
      delete datos.fechaIngreso;
      llamada = this.srvCliente.guardar(datos, id);
      texto = '¡Cambios guardados!'
    } else {
      delete datos.id;
      llamada = this.srvCliente.guardar(datos);
      texto = '¡Creado correctamente!'
    }

    llamada
      .subscribe({
        complete: () => {
          this.filtrar();
          Swal.fire({
            icon: 'success',
            title: texto,
            showConfirmButton: false,
            timer: 1500
          })
        },
        error: (e) => {
          switch (e) {
            case 404:
              Swal.fire({
                title: 'Id Cliente no encontrado',
                icon: 'error',
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cerrar'
              })
              break;
            case 409:
              Swal.fire({
                title: 'Id Cliente ya existe',
                icon: 'error',
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cerrar'
              })
              break;
          }
        }
      })
  }

  //Eventos botones general

  onFiltrar() {
    alert('Filtrando...')
  }
  onImprimir() {
    alert('Imprimiendo...')
  }
  onCerrar() {
    alert('Cerrando catálogo...')
  }
  private filtrar(): void {
    this.srvCliente.filtrar(this.filtro, 1, 10)
      .subscribe(
        data => {
          this.clientes = Object(data);
          console.log(data)
        }
      )
  }
  ngOnInit(): void {
    this.filtro = { idCliente: '', nombre: '', apellido1: '', apellido2: '' };
    this.filtrar();
  }

}
