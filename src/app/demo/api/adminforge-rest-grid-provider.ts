import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { GridDataProvider, GridLoadRequest, GridPage } from '../../core/data-grid/data-grid-provider';
import { AdminForgeListResponse } from './adminforge-api.models';

export abstract class AdminForgeRestGridProvider<T extends { id: string }> implements GridDataProvider<T> {
  protected constructor(
    protected readonly http: HttpClient,
    private readonly baseUrl: string,
    private readonly resource: string,
  ) {}

  async load(request: GridLoadRequest): Promise<GridPage<T>> {
    if (request.filters?.length) {
      throw new Error('AdminForge demo API column filters are not implemented yet.');
    }

    const page = typeof request.continuation === 'number' && request.continuation > 0
      ? request.continuation
      : 1;

    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', request.pageSize);

    const search = request.search?.value?.trim();
    if (search) params = params.set('search', search);

    const sort = request.sort?.[0];
    if (sort) {
      params = params.set('sort', sort.field).set('order', sort.direction);
    }

    const response = await firstValueFrom(
      this.http.get<AdminForgeListResponse<T>>(this.endpoint, { params }),
    );
    const hasMore = response.page * response.pageSize < response.total;

    return {
      items: response.items,
      totalCount: response.total,
      hasMore,
      continuation: hasMore ? response.page + 1 : undefined,
    };
  }

  create(data: Partial<T>): Promise<T> {
    return firstValueFrom(this.http.post<T>(this.endpoint, data));
  }

  update(data: T): Promise<T> {
    return firstValueFrom(this.http.put<T>(`${this.endpoint}/${encodeURIComponent(data.id)}`, data));
  }

  async delete(data: T): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.endpoint}/${encodeURIComponent(data.id)}`));
  }

  private get endpoint(): string {
    return `${this.baseUrl.replace(/\/$/, '')}/${this.resource}`;
  }
}
