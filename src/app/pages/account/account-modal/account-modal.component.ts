import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, Validators, FormGroup  } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { tap } from "rxjs/operators";
import { AuthService } from "src/app/services/auth.service";
import { FeedService } from "src/app/services/feed.service";


@Component({
  selector: "app-account-modal",
  templateUrl: "account-modal.component.html",
  styleUrls: ["./account-modal.component.scss"]
})
export class AccountModalConponent implements OnInit {
  @Input() title: String = "Account";
  @Input() formData: any;
  @Input() roles!: any[];
  @Output() submitevent = new EventEmitter<any>();

  formGroup: FormGroup ;
  
  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    private authSvc: AuthService
    
  ) { 
    this.formGroup = this.fb.group({
        id: [null],
        username: ["", Validators.required],
        password: [null, [Validators.maxLength(30), Validators.pattern('(?=.*[A-Za-z])(?=.*[0-9!@#$%^&]).{8,}')]],
        book_id:[null, Validators.required],
        description: ["",Validators.required],
        disabled: [false, Validators.required],
        company_name:[null],
        roles:[null]
      });
  }

  ngOnInit() {
    if (this.formData){
      this.formGroup.patchValue(this.formData)
    }
      
  }
  isError(item: string) {
    return this.formGroup.get(item)?.invalid &&
      (this.formGroup.get(item)?.dirty || this.formGroup.get(item)?.touched)
  }
  errorType(item: string, type: string) {
    return this.isError(item) && this.formGroup.get(item)?.hasError(type);
  }
  submit() {
    let data = this.formGroup.getRawValue();
    data.id = JSON.parse(this.formGroup.get("id")?.value);
    data.book_id = JSON.parse(this.formGroup.get("book_id")?.value);
    this.modal.close(data);
  }
  show_pass() {
    let pass = document.getElementById("password") as HTMLInputElement;
    pass.type = "text";
  }
  hidden_pass() {
    let pass = document.getElementById("password") as HTMLInputElement;
    pass.type = "password";
  }


 
}

