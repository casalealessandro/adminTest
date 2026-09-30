import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import {
  FormDefinition,
  FormDefinitionRepository,
} from '../../core/forms/contracts/form-definition-repository';
import { normalizeDynamicFormFields } from '../../core/forms/models/dynamic-form-field';
import { ADMINFORGE_API_BASE_URL } from './adminforge-api.config';
import { AdminForgeApiForm, AdminForgeListResponse } from './adminforge-api.models';

@Injectable()
export class AdminForgeFormDefinitionRepository implements FormDefinitionRepository {
  private readonly endpoint: string;

  constructor(
    private readonly http: HttpClient,
    @Inject(ADMINFORGE_API_BASE_URL) baseUrl: string,
  ) {
    this.endpoint = `${baseUrl.replace(/\/$/, '')}/forms`;
  }

  getForms(): Observable<FormDefinition[]> {
    const params = new HttpParams().set('page', 1).set('pageSize', 100).set('sort', 'name').set('order', 'asc');
    return this.http.get<AdminForgeListResponse<AdminForgeApiForm>>(this.endpoint, { params }).pipe(
      map(response => response.items.map(form => this.toFormDefinition(form))),
    );
  }

  getFormById(formId: string): Observable<FormDefinition> {
    return this.http.get<AdminForgeApiForm>(`${this.endpoint}/${encodeURIComponent(formId)}`).pipe(
      map(form => this.toFormDefinition(form)),
    );
  }

  getFormFields(formId: string) {
    return this.getFormById(formId).pipe(map(form => form.json));
  }

  saveForm(formId: string, form: Partial<FormDefinition>): Promise<unknown> {
    const createMode = formId === 'new' || !form.id;
    const id = form.id || formId;
    const payload = {
      ...(createMode ? { id } : {}),
      name: form.nameForm ?? '',
      definition: normalizeDynamicFormFields(form.json ?? []),
    };

    if (createMode) {
      return firstValueFrom(this.http.post(this.endpoint, payload));
    }

    return firstValueFrom(
      this.http.put(`${this.endpoint}/${encodeURIComponent(formId)}`, payload),
    );
  }

  deleteForm(formId: string): Promise<unknown> {
    return firstValueFrom(this.http.delete(`${this.endpoint}/${encodeURIComponent(formId)}`));
  }

  private toFormDefinition(form: AdminForgeApiForm): FormDefinition {
    return {
      id: form.id,
      nameForm: form.name,
      json: normalizeDynamicFormFields(form.definition as any[]),
    };
  }
}
