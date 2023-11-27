import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  status:any;
  imageUrl:any=[];
  resplace:any;
  url:any;
  sitedata:any;
  view:any;
  feedNumber:any;
  SERVER_URL: string = environment.apiUrl +'/Photo/uploadfile'
  SERVER_URL2: string = environment.apiUrl + '/Photo/getPhoto'
  SERVER_URL3: string = environment.apiUrl + '/Photo/getPhotoList'
  constructor(private httpClient: HttpClient) { }
  public upload(formData) {
    if (this.feedNumber != null && this.feedNumber != undefined) {
      this.sitedata.feedNumber = this.feedNumber
    }
    formData.append('feedNumber', this.sitedata.feedNumber);
    return this.httpClient.post<any>(this.SERVER_URL, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
  public getimage(dataname) {

    return this.httpClient.get(this.SERVER_URL2 + '?feedNumber=' + this.sitedata.feedNumber +'&filename=' + dataname.imgName, { responseType: 'blob' });

  }
  public getimagedata() {


    return this.httpClient.get(this.SERVER_URL3 + '?feedNumber=' + this.sitedata.feedNumber);

  }
  public getapi() {

    let header = new HttpHeaders()

      .set('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, HEAD, OPTIONS')
      .set('Access-Control-Allow-Origin', '*')
        return this.httpClient.get('https://vipmember.tmtd.cpc.com.tw//opendata/ListPriceWebService.asmx/getCPCMainProdListPrice?',
     { responseType: 'text'});

  }
}
