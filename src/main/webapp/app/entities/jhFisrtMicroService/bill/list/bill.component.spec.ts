import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BillService } from '../service/bill.service';

import { BillComponent } from './bill.component';

describe('Bill Management Component', () => {
  let comp: BillComponent;
  let fixture: ComponentFixture<BillComponent>;
  let service: BillService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'jhfisrtmicroservice/bill', component: BillComponent }]), HttpClientTestingModule],
      declarations: [BillComponent],
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
      .overrideTemplate(BillComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BillComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BillService);

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
    expect(comp.bills?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to billService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getBillIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getBillIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
