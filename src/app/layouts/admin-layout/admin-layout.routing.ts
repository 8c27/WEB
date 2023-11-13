import { Routes } from "@angular/router";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { StockComponent } from "src/app/pages/stock/stock.component";
import { ClientComponent } from "src/app/pages/client/client.component";
// import { RtlComponent } from "../../pages/rtl/rtl.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "stock", component: StockComponent },
  { path: "client", component: ClientComponent}
];
