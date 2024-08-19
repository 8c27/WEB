import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FeedService } from 'src/app/services/feed.service';

@Component({
  selector: 'app-delivery-drop',
  templateUrl: './delivery-drop.component.html',
  styleUrls: ['./delivery-drop.component.scss']
})
export class DeliveryDropComponent implements OnInit {
  @Input() title: String = "順序編輯";
  address: any;
  oldAddress: any;
  selected: any;
  movies = [
    'Episode I - The Phantom Menace',
    'Episode II - Attack of the Clones',
    'Episode III - Revenge of the Sith',
    'Episode IV - A New Hope',
    'Episode V - The Empire Strikes Back',
    'Episode VI - Return of the Jedi',
    'Episode VII - The Force Awakens',
    'Episode VIII - The Last Jedi',
    'Episode IX – The Rise of Skywalker'
  ];

  constructor(
    public modal: NgbActiveModal,
    public api: FeedService
  )
  {

  }

  ngOnInit(): void {
    this.api.getDelivery().subscribe( data => {
      this.address = JSON.parse(JSON.stringify(data))
      this.oldAddress = JSON.parse(JSON.stringify(data))
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.address, event.previousIndex, event.currentIndex);
    // 更新 order_id
    this.address.forEach((item, index) => {
      item.orderId = index;
    });
  }

  save(){
    const differences = this.findDifference(this.address, this.oldAddress)
    this.modal.close(differences)
  }

  cancel(){
    this.modal.close(false)
  }
  
  findDifference(newArray , oldArray){
    const difference = []
    newArray.forEach((newItem, index) => {
      const oldItem = oldArray[index]

      if(!oldItem || JSON.stringify(newItem)!== JSON.stringify(oldItem)){
        difference.push(newItem)
      }
    })
    return difference
  }

  getTopFive(index: number): string {
    const colors = ['first', 'second', 'third', 'fourth', 'fifth'];
    return colors[index] || '';
  }

}

