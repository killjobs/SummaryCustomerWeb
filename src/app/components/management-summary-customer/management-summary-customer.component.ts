import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SummaryCustomer } from '../../models/summary-customer';
import { SummaryCustomerService } from '../../services/summary-customer.service';
import { Router } from '@angular/router';
import { mensajeError, mensajeExitoso } from '../../Common/utils/HandleMessages';
import { CustomDatePipe } from '../../Common/pipes/custom-date.pipe';
import { min } from 'rxjs';

@Component({
  selector: 'app-management-summary-customer',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule, CustomDatePipe],
  templateUrl: './management-summary-customer.component.html',
  styleUrl: './management-summary-customer.component.scss'
})
export class ManagementSummaryCustomerComponent {
  @Input() isEditing: boolean = false;
  @Input() customer: any = null;  
  customerForm!: FormGroup;
  maxDate = new Date().toISOString();
  formattedCost: string = '';

  selectedCustomer: SummaryCustomer = {
    id: 0,
    userId: 0,
    orderNumber: 0,
    fullName: '',
    phoneNumber: '',
    purchaseSummary: '',
    cost: 0,
    active: true
  };
  private validationMessages: {[key:string]: {[error:string]:string}} = {
    orderNumber:{
      required:'Este campo es obligatorio.',
      pattern:'Ingrese solo números.',
      min:'El valor minimo permitido en el campo es 1',
      maxlength:'El valor maximo permitido en el campo es 9999'
    },
    createdDate:{
      required:'Seleccione una fecha válida.'
    },
    fullName:{
      required:'Este campo es obligatorio.',
      pattern:'Ingrese solo letras y sin espacios al inicio o final.',
      maxlength:'Maximo puede ingresar 250 caracteres'      
    },
    phoneNumber:{
      required:'Este campo es obligatorio.',
      pattern:'Ingrese solo números.',
      minlength:'Debe ingresar minimo 7 caracteres',
      maxlength:'Debe ingresar maximo 12 caracteres'
    },
    purchaseSummary:{
      required:'Este campo es obligatorio.',
      maxlength:'Maximo puede ingresar 500 caracteres'
    },
    cost:{
      required:'Este campo es obligatorio.',
      min:'El valor minimo permitido en el campo es 1.000',
      pattern:'Ingrese solo números.',
      max:'El valor maximo permitido en el campo es 9\'999.999'
    },
  };

  constructor(private fb: FormBuilder, 
                 private summaryCustomerService: SummaryCustomerService, 
                 private router: Router,
                 public activeModal: NgbActiveModal) {}

  ngOnInit() {
    this.customerForm = this.fb.group({
      orderNumber: ['', [Validators.required, Validators.pattern(/^\d+$/), Validators.min(1), Validators.maxLength(4)]], // Solo números
      createdDate: ['', [Validators.required]], // Fecha obligatoria
      fullName: ['', [Validators.required, Validators.pattern(/^(?! )[A-Za-z ]*(?<! )$/), Validators.maxLength(250)]], // Solo letras y espacios (sin espacios al inicio o al final)
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d+$/), Validators.minLength(7), Validators.maxLength(12)]], // Solo números
      purchaseSummary: ['', [Validators.required, Validators.maxLength(500)]],
      cost: ['', [Validators.required, Validators.min(1000), Validators.pattern(/^\d+$/), Validators.max(9999999)]]
      //cost: ['', [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]], // Solo números y mayor a 0
    });
    this.loadSummaryCustomer(this.customer);
  }

  getErrorMessage(field: string): string {
    let control = this.customerForm.controls[field];
    
    if (!control || !control.errors || !control.touched){
      return '';
    } 

    let controlMessage = this.validationMessages[field];
      for(const errorKey in control.errors){
        if(controlMessage && controlMessage[errorKey]){
          return controlMessage[errorKey];
        }
      }
    return 'Campo inválido.'
  }

  loadSummaryCustomer(customer?: any): void {
    if (customer) {
      setTimeout(() => {
        customer.createdDate = customer.createdDate ? customer.createdDate.split('T')[0] : '';
        this.selectedCustomer = customer;
        this.customerForm.patchValue(customer);
        
        const costControl = this.customerForm.get('cost');
        if (costControl) {
          const numericValue = Number(customer.cost) || 0;
          costControl.setValue(numericValue, { emitEvent: false });

          const input = document.getElementById('cost') as HTMLInputElement;
          if (input) {
            input.value = this.formatCurrency(numericValue);
          }
        }
      });
    } else {
      this.limpiarFormulario();
    }
  }

  saveUpdateSummaryCustomer() {
    if (this.customerForm.valid) {
      this.selectedCustomer.orderNumber = Number(this.customerForm.value.orderNumber);
      this.selectedCustomer.fullName = this.customerForm.value.fullName;
      this.selectedCustomer.createdDate = this.customerForm.value.createdDate;
      this.selectedCustomer.phoneNumber = this.customerForm.value.phoneNumber;
      this.selectedCustomer.purchaseSummary = this.customerForm.value.purchaseSummary;
      this.selectedCustomer.cost = this.customerForm.value.cost;
      this.selectedCustomer.active = true;
      this.summaryCustomerService.SaveUpdateSummaryCustomer(this.selectedCustomer).subscribe({
        next:(result:any)=>{
          mensajeExitoso("Paciente Creado / Actualizado correctamente");
          this.activeModal.close();
        },
        error:()=>{
          mensajeError('Se presento un error al realizar la actualización / guardado del paciente.');
        },
        complete:()=>{
          this.limpiarFormulario();
          this.router.navigate([`home`]);
        }
      });
    }
  }

  cancel() {
    this.activeModal.dismiss(); // simplemente cierra el modal
  }

  limpiarFormulario() {
    this.isEditing = false;
    this.customerForm.reset();
    this.customer = null;
    this.selectedCustomer = {
      id: 0,
      userId: 0,
      orderNumber: 0,
      fullName: '',
      phoneNumber: '',
      purchaseSummary: '',
      cost: 0,
      active: true
    }
  }

  formatCurrency(value: number): string {
    if (!value || isNaN(value)) return '';
    return '$ ' + value.toLocaleString('es-CO');
  }

  onCostInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const rawValue = input.value.replace(/\D/g, ''); // Solo dígitos
    const numericValue = Number(rawValue);

    // Actualiza el valor del FormControl sin perder las validaciones
    this.customerForm.get('cost')?.setValue(numericValue, { emitEvent: false });

    // Formatea y actualiza el DOM
    input.value = this.formatCurrency(numericValue);
  }
}
