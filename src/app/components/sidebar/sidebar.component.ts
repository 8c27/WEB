import { Component, OnInit } from "@angular/core";

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "進料系統",
    icon: "icon-chart-pie-36",
    class: ""
  },
  {
    path: "/icons",
    title: "加工單",
    icon: "icon-atom",
    class: ""
  },
  {
    path: "/maps",
    title: "客戶基本資料",
    icon: "icon-pin",
    class: "" },
  {
    path: "/notifications",
    title: "帳號管理",
    icon: "icon-bell-55",
    class: ""
  },

  {
    path: "/user",
    title: "帳號管理",
    icon: "icon-single-02",
    class: ""
  },
  {
    path: "/tables",
    title: "帳號管理",
    icon: "icon-puzzle-10",
    class: ""
  },

];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() {}

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }
}
