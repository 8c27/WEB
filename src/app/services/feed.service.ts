import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";

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

}