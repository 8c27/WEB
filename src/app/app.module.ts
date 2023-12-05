import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { ToastrModule } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import {MatCardModule} from '@angular/material/card';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AppRoutingModule } from "./app-routing.module";
import { MatButtonModule } from '@angular/material/button';
import { dashboardModalContent } from "./pages/dashboard/dashboard-modal/dashboard-modal.component";
import { CommonModule } from "@angular/common";
import { MatTableModule } from "@angular/material/table";
import { FooterComponent } from "./components/footer/footer.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { TableComponent } from "./components/sm-table/sm-table.component";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { StockComponent } from "./pages/stock/stock.component";
import { StockModalConponent } from "./pages/stock/stock-modal/stock-modal.component";
import { ClientModalConponent } from "./pages/client/client-modal/client-modal.component";
import { ClientComponent } from "./pages/client/client.component";
import { NgSelectModule } from '@ng-select/ng-select';
import { ImageDialogComponent } from "./components/image-dialog/image-dialog.component";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { MatIconModule } from '@angular/material/icon';
import { ExportExcelComponent } from "./components/export-excel/export-excel.component";
import { LoginComponent } from "./login/login/login.component";
import { JwtInterceptor, JwtModule, JWT_OPTIONS, JwtConfig, JwtHelperService } from '@auth0/angular-jwt';
import { environment } from "src/environments/environment";
import { AccountComponent } from "./pages/account/account.component";
import { AccountModalConponent } from "./pages/account/account-modal/account-modal.component";
import { MultiSelectComponent } from "./components/multi-select/multi-select.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';

export function tokenGetter(): string | null {
  return localStorage.getItem('access_token');
}
function getJwtConfig(): JwtConfig {
  const cfg: JwtConfig = {
    tokenGetter
  };
  if (!environment.production) {
    cfg.allowedDomains = [...environment.jwt.allowedDomains];
    cfg.disallowedRoutes = [...environment.jwt.disallowedRoutes];
  }
  return cfg;
}

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCardModule,
    NgSelectModule,
    MatSnackBarModule,
    NgImageFullscreenViewModule ,
    MatIconModule,
    JwtModule.forRoot({
      config: getJwtConfig(),
    }),
    MatFormFieldModule,
    MatInputModule
    
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    dashboardModalContent,
    FooterComponent,
    NavbarComponent, 
    SidebarComponent,
    TableComponent,
    DashboardComponent,
    StockComponent,
    StockModalConponent,
    ClientModalConponent,
    ClientComponent,
    ImageDialogComponent,
    ExportExcelComponent,
    LoginComponent,
    AccountComponent,
    AccountModalConponent,
    MultiSelectComponent
  ],
  exports:[
    MultiSelectComponent
  ],
  providers: [JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule {}
