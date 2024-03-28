import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

const apiUrl = environment.apiUrl;
@Injectable({
    providedIn: "root",
})

export class FeedService {
    constructor (private http: HttpClient){
    }

    public getFeed(){
        // 透過restful get 取得 Feed API 
        return this.http.get(apiUrl + "/Feed")
    }

    public addFeed(data){
        // 透過restful post 新增 Feed 
        return this.http.post(apiUrl + "/Feed" , data) 
    }

    public deleteFeed(id){
        // 透過restful delete 刪除 Feed
        return this.http.delete(apiUrl + "/Feed/" + id)
    }

    public editFeed(id, data){
        // 透過restful put 編輯 Feed 
        return this.http.put(apiUrl + "/Feed/" + id, data)
    }

    public getStock(){
        return this.http.get(apiUrl + "/Stock")
    }
    public addStock(data){
        // 透過restful post 新增 Feed 
        return this.http.post(apiUrl + "/Stock" , data) 
    }

    public deleteStock(id){
        // 透過restful delete 刪除 Feed
        return this.http.delete(apiUrl + "/Stock/" + id)
    }

    public editStock(id, data){
        // 透過restful put 編輯 Feed 
        return this.http.put(apiUrl + "/Stock/" + id, data)
    }

    public editAmountStock(data, quantity){
        return this.http.put(apiUrl + "/stockedit/" +quantity, data )
    }

    public getClient(){
        return this.http.get(apiUrl + "/Client")
    }
    public addClient(data){
        return this.http.post(apiUrl + "/Client", data)
    }
    public deleteClient(id){
        return this.http.delete(apiUrl + "/Client/" + id)
    }
    public editClient(id, data){
        return this.http.put(apiUrl + "/Client/" +id, data)
    }
    loginGetToken(
        Username: string,
        Password: string
      ): Observable<{ token: string }> {
        return this.http.post<{ token: string }>(apiUrl + "/login", {
          Username,
          Password,
        });
    }
    public refreshToken(username,token) {

    return this.http.post<{ token: string }>(apiUrl + "/refreshToken", {username:username,token:token});

    }

    public readLoginRoles(){
    return this.http.get<any[]>(apiUrl + "/LoginRoles");
    }

    public readLoginInfo(){
    return this.http.get<any[]>(apiUrl + "/LoginInfo");
    }
     
    public addLoginInfo(data){
        return this.http.post(apiUrl + "/LoginInfo" , data) 
    }
    public editLoginInfo(id, data){
        return this.http.put(apiUrl + "/LoginInfo/" +id, data)
    }
    public deleteLoginInfo(id){
        return this.http.delete(apiUrl + "/LoginInfo/" + id)
    }

    public getDelivery(){
        return this.http.get(apiUrl + "/Delivery")
    }

    public addDelivery(data){
        return this.http.post(apiUrl + "/Delivery", data)
    }

    public deleteDelivery(id){
        return this.http.delete(apiUrl + "/Delivery/"+ id)
    }
}