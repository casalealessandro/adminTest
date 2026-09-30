import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { AdminForgeFormDefinitionRepository } from './adminforge-form-definition.repository';

describe('AdminForgeFormDefinitionRepository', () => {
  let http: jasmine.SpyObj<HttpClient>;
  let repository: AdminForgeFormDefinitionRepository;

  beforeEach(() => {
    http = jasmine.createSpyObj<HttpClient>('HttpClient', ['get', 'post', 'put', 'delete']);
    repository = new AdminForgeFormDefinitionRepository(http, 'http://localhost:3000/api');
  });

  it('maps backend name/definition to the Core nameForm/json contract', done => {
    http.get.and.returnValue(of({
      id: 'profile',
      name: 'Profile',
      definition: [{ name: 'email', type: 'textBox', typeInput: 'email', label: 'Email' }],
      createdAt: '',
      updatedAt: '',
    }));

    repository.getFormById('profile').subscribe(form => {
      expect(form.id).toBe('profile');
      expect(form.nameForm).toBe('Profile');
      expect(form.json[0].name).toBe('email');
      done();
    });
  });

  it('uses POST for new definitions and PUT for existing ones', async () => {
    http.post.and.returnValue(of({ ok: true }));
    http.put.and.returnValue(of({ ok: true }));

    await repository.saveForm('new', { id: 'demo', nameForm: 'Demo', json: [] });
    expect(http.post).toHaveBeenCalledWith('http://localhost:3000/api/forms', {
      id: 'demo',
      name: 'Demo',
      definition: [],
    });

    await repository.saveForm('demo', { id: 'demo', nameForm: 'Updated', json: [] });
    expect(http.put).toHaveBeenCalledWith('http://localhost:3000/api/forms/demo', {
      name: 'Updated',
      definition: [],
    });
  });
});
