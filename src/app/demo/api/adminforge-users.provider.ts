import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ADMINFORGE_API_BASE_URL } from './adminforge-api.config';
import { AdminForgeUser } from './adminforge-api.models';
import { AdminForgeRestGridProvider } from './adminforge-rest-grid-provider';

@Injectable({ providedIn: 'root' })
export class AdminForgeUsersProvider extends AdminForgeRestGridProvider<AdminForgeUser> {
  constructor(http: HttpClient, @Inject(ADMINFORGE_API_BASE_URL) baseUrl: string) {
    super(http, baseUrl, 'users');
  }
}
