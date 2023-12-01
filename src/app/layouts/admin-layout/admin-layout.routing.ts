import { Routes } from "@angular/router";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { StockComponent } from "src/app/pages/stock/stock.component";
import { ClientComponent } from "src/app/pages/client/client.component";
import { AuthGuard } from '../../auth.guard';
import { LoginComponent } from "src/app/login/login/login.component";
// import { RtlComponent } from "../../pages/rtl/rtl.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent , canActivate: [AuthGuard]},
  { path: "stock", component: StockComponent , canActivate: [AuthGuard]},
  { path: "client", component: ClientComponent, canActivate: [AuthGuard]}
];
