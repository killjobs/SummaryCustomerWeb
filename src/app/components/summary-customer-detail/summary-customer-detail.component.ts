import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SummaryCustomerService } from '../../services/summary-customer.service';
import { NgbAccordionModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomNumberPipe } from '../../Common/pipes/custom-number.pipe';
@Component({
  selector: 'app-summary-customer-detail',
  standalone: true,
  imports: [CommonModule,NgbAccordionModule,CustomNumberPipe],
  templateUrl: './summary-customer-detail.component.html',
  styleUrl: './summary-customer-detail.component.scss'
})

export class SummaryCustomerDetailComponent {
  customerDetail: any[] = [];
  complementText: string = "";
  dataLoaded: boolean = false;
  isLoading: boolean = false;
  
  @Input() customer: any; // Recibimos la información del cliente
    
  constructor(private summaryCustomerService : SummaryCustomerService,
              public activeModal: NgbActiveModal) {
    this.close();
  }

  getSummaryDetail(position: number) {
    this.dataLoaded = false;
    this.isLoading = true;

    this.complementText = position == 1 ? "Nombre" : "Teléfono";
    let searchText:string = position == 1 ? this.customer.fullName : this.customer.phoneNumber;
    let id:number = this.customer.id;
    this.summaryCustomerService.GetSummaryCustomerDetail(searchText,id).subscribe(data => {
      this.customerDetail = data.result;
      this.isLoading = false;
      this.dataLoaded = true;
    });
  }

  close(){
    this.complementText = "";
    this.customerDetail = [];
    this.activeModal.dismiss();
  }
}
