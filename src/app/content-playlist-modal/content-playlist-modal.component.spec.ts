import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentPlaylistModalComponent } from './content-playlist-modal.component';

describe('ContentPlaylistModalComponent', () => {
  let component: ContentPlaylistModalComponent;
  let fixture: ComponentFixture<ContentPlaylistModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentPlaylistModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentPlaylistModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});