import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LaunchChallengePage } from './launch-challenge.page';

describe('LaunchChallengePage', () => {
  let component: LaunchChallengePage;
  let fixture: ComponentFixture<LaunchChallengePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaunchChallengePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LaunchChallengePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
