
import { Component, OnInit, ViewChild, ElementRef, Pipe } from '@angular/core';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { formatDate } from '@angular/common';
import { PhotoService } from 'src/app/services/photo.service';
import { MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss']
})
export class ImageDialogComponent {

  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef; files = [];
  currentIndex: number;

  constructor(private uploadService: PhotoService,
    private sanitizer: DomSanitizer,
    private snackbar: MatSnackBar)
  {
  }
  public imagePath;
  imgURL: any=[];
  name = 'Angular 12';
  url: any = '';
  geturl:any;
  dataname:any;
  namedate:any;
  showFlag: boolean = false;
  selectedImageIndex: number = -1;
  imageObject: Array<object> = [];
  view:any;
  repeat:any=[];
  showLightbox(index) {
    this.selectedImageIndex = index;
    this.showFlag = true;
  }

  closeEventHandler() {
    this.showFlag = false;
    this.currentIndex = -1;
  }
ngOnInit(){

  this.view=this.uploadService.view
  this.uploadService.getimagedata().subscribe(
    res => {
      this.dataname=res

      for(let i=0;i<(<any>res).length;i++){
        this.uploadService.getimage(res[i]).subscribe(
          data => {

            this.geturl = URL.createObjectURL(data);
            this.imgURL[i]=this.geturl
            for (let i = 0; i < (<any>this.imgURL).length; i++){
              this.imageObject[i]={
                image: this.imgURL[i], thumbImage: this.imgURL[i], alt: 'alt of image',
                title: this.dataname[i].imgName
              }
            }

          }
        );
      }

    }
  );
}

  uploadFile(file) {

    const formData = new FormData();
    formData.append('files', file.data);
    formData.append('namedate', file.namedate);


    file.inProgress = true;
    this.uploadService.upload(formData).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            console.log(event)
            file.progress = Math.round(event.loaded * 100 / event.total);

            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status >= 200 && error.status<=226){
          if (this.files.find(a => a.status == 0) == undefined){
            this.snackbar.open('上傳成功。', '確定', { duration: 3000 })
          }

       }else{
         this.snackbar.open('上傳失敗，請確認場所地點是否已選擇及網路連線狀態。', '確定', { duration: 3000 })
         file.progress = 0
       }
        return of(`${file.data.name} 上傳失敗`);
      })).subscribe((event: any) => {
        if (typeof (event) === 'object') {


        }
      });
  }
  public uploadFiles() {

    this.fileUpload.nativeElement.value = '';
    this.files.forEach(file => {
      if (this.dataname.find(a => a.imgName == file.data.name)==undefined){
       this.uploadFile(file);
       file.status=1;
     }else{
       if(file.status==0){
       this.repeat.push(file)

       }
     }


    });
    if(Number(this.repeat)!=0){
    const ref = this.snackbar.open('派工單已有相同名稱圖片，你確定要覆蓋嗎?', '確定', { duration: 3000 });
    ref.onAction().subscribe(() => {
     this.repeat.forEach(file => {
       this.uploadFile(file);
       file.status = 1;
     });
      this.repeat = []
    });
  }
  }

  cancel(index){
    this.files.splice(index,1)
    this.imageObject.splice(index+this.imgURL.length,1)
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }


  onClick() {
    const fileUpload = this.fileUpload.nativeElement; fileUpload.onchange = () => {
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        var reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = (event) => {

          this.url = (<FileReader>event.target).result;
          // file.name=date.getFullYear().toString() + date.getMonth().toString() + date.getDay().toString()
          //   + date.getHours().toString() + date.getMinutes().toString()+file.
          if (this.files.find(a => a.data.name == file.name) == undefined){
          this.files.push({ data: file, inProgress: false, progress: 0, url: this.url, namedate: this.namedate ,status:0 });
          this.uploadService.imageUrl[index]=this.url
          this.imageObject.push({
            image: this.url, thumbImage: this.url, alt: 'alt of image',
            title: file.name
          })
        }

        }
      }


    };
    fileUpload.click();
  }


}
