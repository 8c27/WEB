import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  pdfContent = new Subject<any>();
  status:any;
  imageUrl:any=[];
  resplace:any;
  url:any;
  sitedata:any;
  view:any;
  stockId:any;
  SERVER_URL: string = environment.apiUrl +'/Photo/uploadfile'
  SERVER_URL2: string = environment.apiUrl + '/Photo/getPhoto'
  SERVER_URL3: string = environment.apiUrl + '/Photo/getPhotoList'
  constructor(private httpClient: HttpClient) { }
  public upload(formData) {
    if (this.stockId != null && this.stockId != undefined) {
      this.sitedata.feedNumber = this.stockId
    }
    formData.append('stockId', this.sitedata.id);
    return this.httpClient.post<any>(this.SERVER_URL, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
  public getimage(dataname) {

    return this.httpClient.get(this.SERVER_URL2 + '?stockId=' + this.sitedata.id +'&filename=' + dataname.imgName, { responseType: 'blob' });

  }
  public getimagedata() {
    return this.httpClient.get(this.SERVER_URL3 + '?stockId=' + this.sitedata.id);
  }
  public getapi() {

    let header = new HttpHeaders()

      .set('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, HEAD, OPTIONS')
      .set('Access-Control-Allow-Origin', '*')
        return this.httpClient.get('https://vipmember.tmtd.cpc.com.tw//opendata/ListPriceWebService.asmx/getCPCMainProdListPrice?',
     { responseType: 'text'});
  }

}
