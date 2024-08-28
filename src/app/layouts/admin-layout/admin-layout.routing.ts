import { Routes } from "@angular/router";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { StockComponent } from "src/app/pages/stock/stock.component";
import { ClientComponent } from "src/app/pages/client/client.component";
import { AuthGuard } from '../../auth.guard';
import { LoginComponent } from "src/app/login/login/login.component";
import { AccountComponent } from "src/app/pages/account/account.component";
import { ShipComponent } from "src/app/pages/ship/ship.component";
import { DeliveryComponent } from "src/app/pages/delivery/delivery.component";
import { OrderHistoryComponent } from "src/app/pages/order-history/order-history.component";
// import { RtlComponent } from "../../pages/rtl/rtl.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent , canActivate: [AuthGuard]},
  { path: "stock", component: StockComponent , canActivate: [AuthGuard]},
  { path: "client", component: ClientComponent, canActivate: [AuthGuard]},
  { path: "account", component: AccountComponent, canActivate: [AuthGuard]},
  { path: "ship", component: ShipComponent, canActivate: [AuthGuard]},
  { path: "delivery", component: DeliveryComponent,canActivate: [AuthGuard] },
  { path: "order-history", component: OrderHistoryComponent, canActivate: [AuthGuard]}
];
