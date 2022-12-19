import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AmountService } from '../service/amount.service';

import { AmountComponent } from './amount.component';

describe('Amount Management Component', () => {
  let comp: AmountComponent;
  let fixture: ComponentFixture<AmountComponent>;
  let service: AmountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'jhfisrtmicroservice/amount', component: AmountComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [AmountComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(AmountComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AmountComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AmountService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.amounts?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to amountService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAmountIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAmountIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
