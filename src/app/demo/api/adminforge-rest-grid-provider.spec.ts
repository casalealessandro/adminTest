import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { GridLoadRequest } from '../../core/data-grid/data-grid-provider';
import { AdminForgeRestGridProvider } from './adminforge-rest-grid-provider';

interface TestRow { id: string; name: string; }

class TestProvider extends AdminForgeRestGridProvider<TestRow> {
  constructor(http: HttpClient) { super(http, 'http://localhost:3000/api/', 'rows'); }
}

describe('AdminForgeRestGridProvider', () => {
  let http: jasmine.SpyObj<HttpClient>;
  let provider: TestProvider;

  beforeEach(() => {
    http = jasmine.createSpyObj<HttpClient>('HttpClient', ['get', 'post', 'put', 'delete']);
    provider = new TestProvider(http);
  });

  it('maps DataGrid paging/search/sort to the demo REST API', async () => {
    http.get.and.returnValue(of({ items: [{ id: '2', name: 'Beta' }], total: 45, page: 2, pageSize: 20 }));
    const request: GridLoadRequest = {
      pageSize: 20,
      continuation: 2,
      search: { value: 'beta', conditions: [] },
      sort: [{ field: 'name', direction: 'desc' }],
    };

    const page = await provider.load(request);
    const [url, options] = http.get.calls.mostRecent().args as [string, { params: HttpParams }];

    expect(url).toBe('http://localhost:3000/api/rows');
    expect(options.params.get('page')).toBe('2');
    expect(options.params.get('pageSize')).toBe('20');
    expect(options.params.get('search')).toBe('beta');
    expect(options.params.get('sort')).toBe('name');
    expect(options.params.get('order')).toBe('desc');
    expect(page.items.length).toBe(1);
    expect(page.totalCount).toBe(45);
    expect(page.hasMore).toBeTrue();
    expect(page.continuation).toBe(3);
  });

  it('does not silently drop unsupported column filters', async () => {
    await expectAsync(provider.load({
      pageSize: 20,
      filters: [{ field: 'active', operator: 'eq', value: true }],
    })).toBeRejectedWithError(/column filters/i);
    expect(http.get).not.toHaveBeenCalled();
  });

  it('maps CRUD mutations using row identity outside the Core', async () => {
    http.post.and.returnValue(of({ id: '1', name: 'Created' }));
    http.put.and.returnValue(of({ id: '1', name: 'Updated' }));
    http.delete.and.returnValue(of(undefined));

    expect(await provider.create!({ name: 'Created' })).toEqual({ id: '1', name: 'Created' });
    expect(await provider.update!({ id: '1', name: 'Updated' })).toEqual({ id: '1', name: 'Updated' });
    await provider.delete!({ id: '1', name: 'Updated' });

    expect(http.post).toHaveBeenCalledWith('http://localhost:3000/api/rows', { name: 'Created' });
    expect(http.put).toHaveBeenCalledWith('http://localhost:3000/api/rows/1', { id: '1', name: 'Updated' });
    expect(http.delete).toHaveBeenCalledWith('http://localhost:3000/api/rows/1');
  });
});
