import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { TdItemComponent } from './td-item.component';
import { AnagraficaService } from '../../../services/anagrafica.service';

describe('TdItemComponent campoLista rendering', () => {
  let component: TdItemComponent;
  let fixture: ComponentFixture<TdItemComponent>;

  const options = {
    valueExp: 'id',
    displayExp: 'value',
    options: [
      { id: 'creator', value: 'Creator' },
      { id: 'admin', value: 'Admin' },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TdItemComponent],
      providers: [{
        provide: AnagraficaService,
        useValue: {
          getElenco: jasmine.createSpy('getElenco').and.returnValue(of([])),
          getValue: jasmine.createSpy('getValue').and.resolveTo(null),
        },
      }],
    }).compileComponents();

    fixture = TestBed.createComponent(TdItemComponent);
    component = fixture.componentInstance;
    component.colType = 'campoLista';
    component.colProperty = {
      colAlignment: 'left',
      dataField: 'role',
      customizedOptions: options,
    };
  });

  it('renders known list values without changing labels', () => {
    component.value = 'creator';
    fixture.detectChanges();
    expect(component.staticData).toBe('Creator');
  });

  it('does not throw when a loading placeholder has a null value', () => {
    component.value = null;
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(component.staticData).toBe('');
  });

  it('keeps unmatched non-null values', () => {
    component.value = 'legacy-role';
    fixture.detectChanges();
    expect(component.staticData).toBe('legacy-role');
  });

  it('preserves boolean false as a valid list key', () => {
    component.colProperty.customizedOptions = {
      valueExp: 'id', displayExp: 'value',
      options: [{ id: false, value: 'ATTIVO' }, { id: true, value: 'DISABILITATO' }],
    };
    component.value = false;
    fixture.detectChanges();
    expect(component.staticData).toBe('ATTIVO');
  });

  it('handles missing configuration and missing values', () => {
    component.colProperty.customizedOptions = undefined;
    component.value = undefined;
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(component.staticData).toBe('');
  });
});
