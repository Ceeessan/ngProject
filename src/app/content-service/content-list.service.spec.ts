import { TestBed } from '@angular/core/testing';

import { ContentListService } from './content-list.service';

describe('ContentListService', () => {
  let service: ContentListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
