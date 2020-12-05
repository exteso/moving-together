import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchChallengePage } from './search-challenge.page';

describe('SearchChallengePage', () => {
  let component: SearchChallengePage;
  let fixture: ComponentFixture<SearchChallengePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchChallengePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchChallengePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
