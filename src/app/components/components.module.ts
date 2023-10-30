import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { FooterComponent } from "./footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { TableComponent } from "./sm-table/sm-table.component";
import { MatTableModule } from "@angular/material/table";

@NgModule({
  imports: [CommonModule, RouterModule, NgbModule,MatTableModule],
  declarations: [FooterComponent, NavbarComponent, SidebarComponent,TableComponent],
  exports: [FooterComponent, NavbarComponent, SidebarComponent,TableComponent]
})
export class ComponentsModule {}
