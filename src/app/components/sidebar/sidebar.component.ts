import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "訂單系統",
    icon: "icon-cart",
    class: ""
  },
  {
    path: "/stock",
    title: "庫存管理",
    icon: "icon-paper",
    class: ""
  },
  {
    path: "/client",
    title: "客戶資料",
    icon: "icon-single-02",
    class: ""
  },
  {
    path: "/account",
    title: "帳號管理",
    icon: "icon-badge",
    class: ""
  },
  {
    path: "/ship",
    title: "出貨進度",
    icon: "icon-bus-front-12",
    class: ""
  }
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor(public  authSvc:AuthService ) {}

  ngOnInit() {
    
  }
  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }
}
