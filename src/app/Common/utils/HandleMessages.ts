import Swal from "sweetalert2";

export function mensajeError(text:string){
    Swal.fire({
        title: 'Error',
        text: text,
        icon: 'error',
        confirmButtonText:'Continuar'
      });
}

export function mensajeExitoso(text : string){
  Swal.fire({
      position: "top-end",
      icon: "success",
      title: text,
      showConfirmButton: false,
      timer: 1500
    });
}

export function mensajeInformativo(text : string){
  Swal.fire({
      title: 'Información',
      text: text,
      icon: 'info',
      confirmButtonText:'Continuar'
    });
}

export function mensajeConfirmacion(remisionId: number): Promise<boolean> {
    return Swal.fire({
      title: 'Confirmación',
      text: `Esta seguro que desea eliminar la remisión #${remisionId}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#51AAB9',
      cancelButtonColor: '#978E8A',
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then(result => result.isConfirmed);
  }
