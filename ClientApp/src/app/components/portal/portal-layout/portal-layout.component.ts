import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-portal-layout',
  standalone: true,
  imports: [MatToolbarModule, MatSidenavModule, MatListModule, RouterOutlet, RouterModule],
  templateUrl: './portal-layout.component.html',
  styleUrl: './portal-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortalLayoutComponent {

}
