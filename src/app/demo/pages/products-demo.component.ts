import { Component, inject } from '@angular/core';
import { DataGridComponent } from '../../core/data-grid/data-grid.component';
import { Colonne } from '../../core/data-grid/models/data-grid.models';
import { AdminForgeProductsProvider } from '../api/adminforge-products.provider';

@Component({
  selector: 'app-products-demo',
  standalone: true,
  imports: [DataGridComponent],
  templateUrl: './products-demo.component.html',
  styleUrl: './demo-page.scss',
})
export class ProductsDemoComponent {
  readonly provider = inject(AdminForgeProductsProvider);

  readonly columns: Colonne[] = [{
    itemType: 'group',
    groupDataField: '',
    data: [
      { type: 'campoImg', colVisible: true, dataField: 'imageUrl', colWidth: 92, colCaption: 'Image', edit: false, groupDataField: undefined },
      { type: 'campo', colVisible: true, dataField: 'name', colWidth: 220, colCaption: 'Name', edit: false, groupDataField: undefined, search: true },
      { type: 'campo', colVisible: true, dataField: 'category', colWidth: 140, colCaption: 'Category', edit: false, groupDataField: undefined, search: true },
      { type: 'campoNumber', colVisible: true, dataField: 'price', colWidth: 110, colCaption: 'Price', edit: false, groupDataField: undefined },
      { type: 'campoTesto', colVisible: true, dataField: 'description', colWidth: 300, colCaption: 'Description', edit: false, groupDataField: undefined, search: true },
      { type: 'campoBoolean', colVisible: true, dataField: 'active', colWidth: 90, colCaption: 'Active', edit: false, groupDataField: undefined },
    ],
  }];
}
