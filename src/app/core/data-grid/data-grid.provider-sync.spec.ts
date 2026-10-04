import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataGridComponent } from './data-grid.component';
import { GridLoadRequest } from './data-grid-provider';

describe('DataGrid provider sync regressions', () => {
  let component: DataGridComponent<any>;
  let fixture: ComponentFixture<DataGridComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataGridComponent);
    component = fixture.componentInstance;
    component.idTable = 'data-grid-provider-sync-test';
    component.tableWidth = 640;
    component.tableWrapWidth = 640;
    component.remoteOperation = true;
    component.providerScrollLoadDelay = 0;
    component.providerFilterDebounce = 0;
    component.providerSearchDebounce = 0;
  });

  it('keeps a provider text filter through delete reload and renders its value', async () => {
    const row = { code: 'ROW-TO-DELETE', name: 'Alessandro' };
    const requests: GridLoadRequest[] = [];
    const deleteRow = jasmine.createSpy('delete').and.resolveTo();

    component.showFilter = true;
    component.colonne = [{
      itemType: 'group',
      caption: '',
      colSpan: 1,
      groupDataField: '',
      data: [{
        dataField: 'name',
        type: 'campo',
        caption: 'Nome',
        colWidth: 180,
        allowFiltering: true,
        validation: [],
      }],
    }] as any;
    component.colsHeader = [{
      dataField: 'name',
      type: 'campo',
      search: true,
      colWidth: 180,
    }] as any;
    component.dataProvider = {
      load: async request => {
        requests.push(request);
        return { items: requests.length === 1 ? [row] : [], hasMore: false };
      },
      delete: deleteRow,
    };

    await component.applyProviderColumnFilter('name', 'Alessandro');
    fixture.detectChanges();
    await component.deleteProviderRow(row);
    fixture.detectChanges();

    const filters = [{ field: 'name', operator: 'contains' as const, value: 'Alessandro' }];
    const input = fixture.nativeElement.querySelector(
      'input[data-grid-filter-field="name"]'
    ) as HTMLInputElement;

    expect(requests).toEqual([
      { pageSize: 20, filters },
      { pageSize: 20, filters },
    ]);
    expect(component.providerFilterValue('name')).toBe('Alessandro');
    expect(input.value).toBe('Alessandro');
  });

  it('restores typed list and boolean values when the filter row is rebuilt', async () => {
    const requests: GridLoadRequest[] = [];

    component.showFilter = true;
    component.colsHeader = [
      {
        dataField: 'categoryId',
        type: 'campoLista',
        search: true,
        colWidth: 140,
        customizedOptions: {
          displayExp: 'name',
          valueExp: 'id',
          options: [
            { id: 10, name: 'Donna' },
            { id: 20, name: 'Uomo' },
          ],
        },
      } as any,
      { dataField: 'active', type: 'campoBoolean', search: true, colWidth: 100 } as any,
    ];
    component.colonne = [{
      itemType: 'group',
      caption: '',
      colSpan: 2,
      groupDataField: '',
      data: [
        {
          dataField: 'categoryId',
          type: 'campoLista',
          lista: {
            displayExp: 'name',
            valueExp: 'id',
            options: [
              { id: 10, name: 'Donna' },
              { id: 20, name: 'Uomo' },
            ],
            multiple: false,
            remote: false,
            parent: null,
          },
        },
        { dataField: 'active', type: 'campoBoolean' },
      ],
    }] as any;
    component.dataProvider = {
      load: async request => {
        requests.push(request);
        return { items: [], hasMore: false };
      },
    };

    await component.applyProviderColumnFilter('categoryId', '20');
    await component.applyProviderColumnFilter('active', 'false');
    fixture.detectChanges();

    const category = fixture.nativeElement.querySelector(
      'select[data-grid-filter-field="categoryId"]'
    ) as HTMLSelectElement;
    const active = fixture.nativeElement.querySelector(
      'select[data-grid-filter-field="active"]'
    ) as HTMLSelectElement;

    expect(component.providerFilterValue('categoryId')).toBe(20);
    expect(component.providerFilterValue('active')).toBeFalse();
    expect(category.value).toBe('20');
    expect(category.selectedOptions[0].textContent?.trim()).toBe('Uomo');
    expect(active.value).toBe('false');
    expect(active.selectedOptions[0].textContent?.trim()).toBe('No');
    expect(requests[1].filters).toEqual([
      { field: 'categoryId', operator: 'eq', value: 20 },
      { field: 'active', operator: 'eq', value: false },
    ]);
  });

  it('does not clear provider rows and headers synchronously when refresh starts', () => {
    const rows = [{ id: 1, name: 'One' }];
    const headers = [{ dataField: 'name', type: 'campo', caption: 'Name', colWidth: 120 }] as any;

    component.rowsData.set(rows);
    component.colsHeader = headers;
    component.dataProvider = {
      load: jasmine.createSpy('load').and.resolveTo({ items: rows, hasMore: false }),
    };
    spyOn(component, 'renderGrid').and.callFake(async () => undefined);

    component.refresh();

    expect(component.rowsData()).toEqual(rows);
    expect(component.colsHeader).toBe(headers);
    expect(component.renderGrid).toHaveBeenCalledTimes(1);
  });

  it('bulk deletes selected rows once, reloads once and clears selection', async () => {
    const rows = [{ code: 'A' }, { code: 'B' }];
    const deleteMany = jasmine.createSpy('deleteMany').and.resolveTo();
    const load = jasmine.createSpy('load').and.resolveTo({ items: [], hasMore: false });

    component.rowsData.set(rows);
    component.rowSelected = [true, true];
    component.rowSelectedAll = true;
    component.selectionRowMode = 'multiple';
    component.dataProvider = { load, deleteMany };

    const deleted = await component.deleteProviderRows(component.getSelectedRows());

    expect(deleted).toBeTrue();
    expect(deleteMany).toHaveBeenCalledOnceWith(rows);
    expect(load).toHaveBeenCalledOnceWith({ pageSize: 20 });
    expect(component.rowSelected).toEqual([false]);
    expect(component.rowSelectedAll).toBeFalse();
  });

  it('shows the existing toolbar bulk action only when provider bulk delete is available', () => {
    component.showToolbarTop = true;
    component.selectionRowMode = 'multiple';
    component.rowsData.set([{ code: 'A' }, { code: 'B' }]);
    component.rowSelected = [true, true];
    component.dataProvider = {
      load: jasmine.createSpy('load'),
      deleteMany: jasmine.createSpy('deleteMany'),
    };

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.-data-grid-toolbar').length).toBe(1);
    expect(fixture.nativeElement.querySelector('.-data-grid-toolbar-actions').textContent)
      .toContain('Elimina selezionati (2)');
  });

  it('keeps the native scroll position when provider paging starts and while it is loading', async () => {
    component.pageSize = 2;
    component.remoteHasMore = true;
    component.rowsData.set([{ id: 1 }, { id: 2 }]);
    component.dataProvider = {
      load: jasmine.createSpy('load').and.resolveTo({ items: [], hasMore: false }),
    };
    spyOn(component, 'loadNextRemotePage').and.resolveTo(true);

    const scrollTarget = {
      scrollTop: 80,
      scrollHeight: 100,
      clientHeight: 20,
    } as HTMLElement;

    await component.onScroll({ target: scrollTarget } as unknown as Event);

    expect(component.loadNextRemotePage).toHaveBeenCalledTimes(1);
    expect(component.latestScrollTopPosition).toBe(80);
    expect(scrollTarget.scrollTop).toBe(80);

    component.isLoading = true;
    await component.onScroll({ target: scrollTarget } as unknown as Event);
    expect(scrollTarget.scrollTop).toBe(80);
  });

  it('marks only the latest appended provider rows and exposes the loading state', () => {
    component.dataProvider = {
      load: jasmine.createSpy('load').and.resolveTo({ items: [], hasMore: false }),
    };
    component.latestSkipLoaded = 2;
    component.showNullData = false;
    component.colsHeader = [
      { dataField: 'name', type: 'campo', caption: 'Name', colWidth: 120 } as any,
    ];
    component.rowsData.set([
      { id: 1, name: 'One' },
      { id: 2, name: 'Two' },
      { id: 3, name: 'Three' },
      { id: 4, name: 'Four' },
    ]);
    component.isLoading = true;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.-data-grid-provider-appended-row').length).toBe(2);
    const wrapper = fixture.nativeElement.querySelector('#dataGridWrapper') as HTMLElement;
    expect(wrapper.classList.contains('-data-grid-wrapper-loading')).toBeTrue();
    expect(wrapper.getAttribute('aria-busy')).toBe('true');
  });

  it('derives selected rows from the historic selection state without changing its sentinel semantics', () => {
    const rows = [{ id: 1 }, { id: 2 }, { id: 3 }];
    component.selectionRowMode = 'multiple';
    component.rowsData.set(rows);

    component.clickToSelectAllRows();

    expect(component.getSelectedRows()).toEqual(rows);
    expect(component.rowSelected.length).toBe(rows.length + 1);
  });
});
