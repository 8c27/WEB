import { Component, OnInit, Input, Inject, LOCALE_ID } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FeedService } from 'src/app/services/feed.service';

@Component({
    selector: 'app-feed-modal',
    template: './feed-modal.component.html',
    styleUrls: ['./feed-modal.component.scss']
})

export class FeedModalComponent implements OnInit {

    @Input() formData: any;

    formGroup: any;
    title: any;
    
    constructor(@Inject(LOCALE_ID) private loacle : string, private modal: NgbActiveModal, public fb: FormBuilder, public api: FeedService, ){
        
        this.formGroup = this.fb.group({
            id: [0],
            creationTime: [null],
            manufacturer: [null ,Validators.required],
            itemNumner: [null],
            itemName: [null],
            material: [null],
            wire: [null],
            length: [null],
            weight: [null],
            quantity: [null],
            cost: [null],
            raise: [null],
            clase: ['P', Validators.required],
            description: [null],
            isDeleted: [false ,Validators.required],
        })

    }
    ngOnInit(): void {
      
    }
    submit(valid): void{
        // 送出表單後將modal關閉
        if (valid) {
            let data = this.formGroup.getRawValue()
            this.modal.close(data)
        }
    }
    cancel(): void {
        // 關閉modal close
        this.modal.close(false)
    }
}