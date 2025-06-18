import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SummaryCustomerService } from '../../services/summary-customer.service';
import { SummaryCustomer } from '../../models/summary-customer';
import { SummaryCustomerDetailComponent } from '../../components/summary-customer-detail/summary-customer-detail.component';
import { mensajeError,mensajeConfirmacion, mensajeExitoso } from '../../Common/utils/HandleMessages';
import * as bootstrap from 'bootstrap';
import { PermissionService } from '../../services/permission.service';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { NgbAccordionModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManagementSummaryCustomerComponent } from '../../components/management-summary-customer/management-summary-customer.component';
import { CustomNumberPipe } from '../../Common/pipes/custom-number.pipe';

@Component({
  selector: 'app-summary-customer',
  standalone: true,
  imports: [CommonModule, FormsModule, SummaryCustomerDetailComponent, PaginationComponent,ManagementSummaryCustomerComponent, 
    CustomNumberPipe, NgbAccordionModule],
  templateUrl: './summary-customer.component.html',
  styleUrl: './summary-customer.component.scss'
})
export class SummaryCustomerComponent implements OnInit{
  
  constructor(private authService: AuthService, 
              private summaryCustomerService : SummaryCustomerService, 
              private permissionService : PermissionService,
              private modalService: NgbModal){}

  summaryCustomers: SummaryCustomer[] = [];
  searchText: string = '';
  selectedSummary: any = null;

  // Variables para paginación
  pageSizeOptions: number[] = [5, 10, 15, 20, 25, 100];
  page: number = 1;
  pageSize: number = 10;
  totalResult: number = 0;
  delete: boolean = false;
  ngOnInit(): void {
    this.GetSummaryCustomer();
    this.validateRole();
  }

  validateRole(): void {
    const token = sessionStorage.getItem('token');
    const decoded = this.authService['DecodedToken'](token || '');
    if(decoded?.role){
      this.permissionService.setRole(decoded?.role);
      this.delete = this.permissionService.has('delete');
    }
  }

  onSearchChange(): void {
    this.page = 1; // Reiniciar a la primera página al buscar
    this.GetSummaryCustomer();
  }
  
  onPageSizeChange(newPageSize: number): void {
    this.pageSize = newPageSize;
    this.page = 1; // Reiniciar a la primera página al cambiar el tamaño
    this.GetSummaryCustomer();
  }

  changePage(newPage: number): void {
    this.page = newPage;
    this.GetSummaryCustomer();
  }

  get filteredUsers() {
    return this.summaryCustomers.filter(value =>
      value.fullName.toLowerCase().includes(this.searchText.toLowerCase()) ||
      value.phoneNumber.includes(this.searchText) ||
      value.purchaseSummary.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  GetSummaryCustomer(): void {
    this.summaryCustomerService.GetSummaryCustomer(this.searchText, this.page, this.pageSize).subscribe(data => {
      if (data.success) {
        this.summaryCustomers = data.result;
        this.totalResult = data.totalResult;
      } else {
        mensajeError("Error interno, contactar a soporte técnico");
      }
    });
  }

  viewDetail(summary: any) {
    const modalRef = this.modalService.open(SummaryCustomerDetailComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.customer = summary;
  }

  viewCreateSummaryCustomer() {
    var userIdSession = Number(sessionStorage.getItem('userId') != null ? sessionStorage.getItem('userId') : 0);
    const modalRef = this.modalService.open(ManagementSummaryCustomerComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.isEditing = false;
    modalRef.componentInstance.customer = {
      id: 0,
      userId: userIdSession,
      orderNumber: 0,
      fullName: '',
      phoneNumber: '',
      purchaseSummary: '',
      cost: 0
    };

    modalRef.result.then(
      (result) => {
        if (result) {
          this.GetSummaryCustomer();
        }
      },
      () => {}
    );
  }

  viewUpdateSummaryCustomer(customer: any) {
    const modalRef = this.modalService.open(ManagementSummaryCustomerComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.isEditing = true;
    modalRef.componentInstance.customer = customer;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.GetSummaryCustomer();
        }
      },
      () => {}
    );
  }

  confirmDeleteSummaryCustomer(orderId: number) {
    mensajeConfirmacion(orderId)
      .then(confirmado => {
        if (confirmado) {
          // Aquí ejecutas la acción real
          this.deleteSummaryCustomer(orderId);
        }
      });
  }

  deleteSummaryCustomer(orderId: number) {
    // Supón que tienes un userService que elimina
     this.summaryCustomerService.DeleteSummaryCustomer(orderId).subscribe(data => {
      if (data.success) {
        mensajeExitoso('Usuario eliminado correctamente.');
        this.GetSummaryCustomer();
      } else {
        mensajeError("Error interno, contactar a soporte técnico");
      }
    });
  }

  LogOut(): void {
    this.authService.LogOut();
  }

  closeModal(): void {
  const modalElement = document.getElementById('ModalManage');

    if (modalElement) {
      // Obtener la instancia del modal
      const modalInstance = bootstrap.Modal.getInstance(modalElement);

      // Cerrar el modal si la instancia existe
      modalInstance?.hide();

      // Eliminar el div de backdrop manualmente
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.classList.remove('show');
        backdrop.classList.add('fade');
        setTimeout(() => {
          backdrop.remove();
        }, 150);
      }

      // 🔧 LIMPIAR estilos del body
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.body.classList.remove('modal-open'); // Esto también ayuda
    } else {
      mensajeError("Error interno, contactar a soporte técnico");
    }
  }

}
