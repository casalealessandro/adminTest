import { Component, inject } from '@angular/core';
import { DataGridComponent } from '../../core/data-grid/data-grid.component';
import { Colonne } from '../../core/data-grid/models/data-grid.models';
import { AdminForgeUsersProvider } from '../api/adminforge-users.provider';

@Component({
  selector: 'app-users-demo',
  standalone: true,
  imports: [DataGridComponent],
  templateUrl: './users-demo.component.html',
  styleUrl: './demo-page.scss',
})
export class UsersDemoComponent {
  readonly provider = inject(AdminForgeUsersProvider);

  readonly columns: Colonne[] = [{
    itemType: 'group',
    groupDataField: '',
    data: [
      { type: 'campo', colVisible: true, dataField: 'firstName', colWidth: 140, colCaption: 'First name', edit: false, groupDataField: undefined, search: true },
      { type: 'campo', colVisible: true, dataField: 'lastName', colWidth: 140, colCaption: 'Last name', edit: false, groupDataField: undefined, search: true },
      { type: 'campo', colVisible: true, dataField: 'email', colWidth: 240, colCaption: 'Email', edit: false, groupDataField: undefined, search: true },
      { type: 'campo', colVisible: true, dataField: 'role', colWidth: 110, colCaption: 'Role', edit: false, groupDataField: undefined, search: true },
      { type: 'campoBoolean', colVisible: true, dataField: 'active', colWidth: 90, colCaption: 'Active', edit: false, groupDataField: undefined },
      { type: 'campoDateTime', colVisible: true, dataField: 'createdAt', colWidth: 170, colCaption: 'Created', edit: false, groupDataField: undefined },
    ],
  }];
}
