import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../../../services/requests.service';
import { AppConstants } from '../../../utils/app.constants';
import { InvoicesList } from '../../../model/InvoicesList';
import { Route, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cashier-component',
  templateUrl: '../../../templates/dashboard/cashier/cashier-dashboard.template.html',
})
export class CashierComponent implements OnInit {


  invoiceList : InvoicesList[];
  error: string;

  constructor(private router: Router,private route: ActivatedRoute,private requestsService: RequestsService) { }

  ngOnInit() {
    this.getAllInvoicesList();
  }



  public getAllInvoicesList() 
  {
      this.requestsService.getRequest(AppConstants.GET_All_PENDING_INVOICES)
      .subscribe((res :any) =>{
          this.invoiceList = res['responseData'];
          console.log("get All Invoice_Items Data : " + this.invoiceList );
      },
      (error: any) => {
          this.error = error;
      })
  }

// payment.component.ts											
runPayment(id: any) {
  this.router.navigate(['/dashboard/payment/', id]);
}


}
