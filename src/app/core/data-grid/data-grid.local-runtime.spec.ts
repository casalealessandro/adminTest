import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataGridComponent } from './data-grid.component';

describe('DataGridComponent local runtime behavior', () => {
  let component: DataGridComponent;
  let fixture: ComponentFixture<DataGridComponent>;

  const source = [
    { id: 1, name: 'Giacca Blu', categoryId: 10 },
    { id: 2, name: 'Pantalone', categoryId: 20 },
    { id: 3, name: 'Camicia', categoryId: 10 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataGridComponent);
    component = fixture.componentInstance;
    component.idTable = 'data-grid-local-runtime-test';
    component.tableWidth = 640;
    component.tableWrapWidth = 640;
    component.localSearchDebounce = 0;
    component.colonne = [];
    component.colsHeader = [
      { dataField: 'name', type: 'campo' } as any,
      { dataField: 'categoryId', type: 'campoNumber' } as any,
    ];
    fixture.componentRef.setInput('dataSource', source);
    fixture.detectChanges();
  });

  it('keeps a local filter applied after Angular change detection', async () => {
    await component.searchData({
      target: {
        dataset: { gridFilterField: 'name' },
        value: 'cam',
        tagName: 'INPUT',
      },
    });

    fixture.detectChanges();

    expect(component.rowsData()).toEqual([source[2]]);
  });

  it('keeps local sorting applied after Angular change detection', () => {
    component.sortColumn('name');
    fixture.detectChanges();

    expect(component.rowsData().map((row: any) => row.name)).toEqual(['Camicia', 'Giacca Blu', 'Pantalone']);
    expect(component.sortedColumn).toBe('name');
    expect(component.sortDirection).toBe('asc');
  });
});
