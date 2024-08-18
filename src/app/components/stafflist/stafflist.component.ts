import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-stafflist',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './stafflist.component.html',
  styleUrl: './stafflist.component.scss'
})
export class StafflistComponent {
  staff_title="Liste des collaborateurs"

}
