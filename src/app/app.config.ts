import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { FORM_DEFINITION_REPOSITORY } from './core/forms/contracts/form-definition-repository';
import { POPUP_REGISTRY } from './core/popup/popup-registry';
import { starterKitEntryComponents } from './core/popup/starter-kit-entry-components';
import { ADMINFORGE_API_BASE_URL } from './demo/api/adminforge-api.config';
import { AdminForgeFormDefinitionRepository } from './demo/api/adminforge-form-definition.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    { provide: ADMINFORGE_API_BASE_URL, useValue: 'http://localhost:3000/api' },
    { provide: FORM_DEFINITION_REPOSITORY, useClass: AdminForgeFormDefinitionRepository },
    { provide: POPUP_REGISTRY, useValue: starterKitEntryComponents },
  ],
};
