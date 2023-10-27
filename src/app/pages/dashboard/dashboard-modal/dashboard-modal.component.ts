import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { tap } from "rxjs/operators";


@Component({
  selector: "app-dashboard-modal",
  templateUrl: "dashboard-modal.component.html",
  styleUrls: ["./dashboard-modal.component.scss"]
})
export class dashboardModalContent implements OnInit {
  @Input() title: String = "{ERROR}";
  @Output() submitevent = new EventEmitter<any>();
  
  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
  ) { }
  ngOnInit() {
   
  }

 
  submit() {
  
  }
}

