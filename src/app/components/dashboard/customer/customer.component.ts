import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl,FormBuilder,Validators} from '@angular/forms';

@Component({
    selector: 'customer-component',
    templateUrl: '../../../templates/dashboard/customer_app/customer-dashboard-template.html',
})
export class CustomerComponent implements OnInit
{
    myform: FormGroup;
    title = 'Customer Profile Setup';

    langs: string[] = [
        'English',
        'French',
        'German',
    ]

    contactForm = new FormGroup({
        firstname: new FormControl(),
        lastname: new FormControl(),
        email: new FormControl(),
        password: new FormControl(),
        language: new FormControl(),
    })


    ngOnInit(){
        this.title = 'Customer Profile Setup';
    }

    onSubmit() {
        if (this.contactForm.valid) {
          //  alert("finally Method call"+this.langs.values());
            console.log(this.contactForm.value);
           // this.myform.reset();
        }
    }


  /*  createForm() {
        this.myform = new FormGroup({
            name: new FormGroup({
                firstName: this.firstName,
                lastName: this.lastName,
            }),
            email: this.email,
            password: this.password,
            language: this.language
        });
    }*/

   /* createFormControls() {
        this.firstName = new FormControl('', Validators.required);
        this.lastName = new FormControl('', Validators.required);
        this.email = new FormControl('', [
            Validators.required,
            Validators.pattern("[^ @]*@[^ @]*")
        ]);
        this.password = new FormControl('', [
            Validators.required,
            Validators.minLength(8)
        ]);
        this.language = new FormControl('');
    }*/




}
