import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, Validators, FormGroup  } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { tap } from "rxjs/operators";
import { FeedService } from "src/app/services/feed.service";


@Component({
  selector: "app-dashboard-modal",
  templateUrl: "dashboard-modal.component.html",
  styleUrls: ["./dashboard-modal.component.scss"]
})
export class dashboardModalContent implements OnInit {
  @Input() title: String = "Feed";
  @Input() formData: any;

  @Output() submitevent = new EventEmitter<any>();

  formGroup: FormGroup ;
  
  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    public api: FeedService,
    
  ) { 
    this.formGroup = this.fb.group({
      id: [0],
      creationTime: [null],
      manufacturer: [null, Validators.required],
      itemNumber: [null],
      itemName: [null],
      material: [null],
      wire: [null],
      length: [null],
      weight: [null],
      quantity: [null],
      cost: [null],
      raise: [0],
      class: ['P'],
      description: [null],
      isDeleted: [false , Validators.required],
    })
  }

  ngOnInit() {
    if (this.formData){
      this.formGroup.patchValue(this.formData)
    }
      
  }

  save(){
      let data = this.formGroup.getRawValue();
      this.modal.close(data)
  }

  cancel(){
    this.modal.close(false)
  }


 
}

