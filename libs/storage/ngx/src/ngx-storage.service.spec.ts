import { TestBed } from '@angular/core/testing';

import { NgxStorageService } from './ngx-storage.service';

describe('NgxStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxStorageService = TestBed.get(NgxStorageService);
    expect(service).toBeTruthy();
  });
});
