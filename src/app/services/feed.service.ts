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
}