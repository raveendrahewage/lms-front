import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Constant } from '../constant/constant';
import { Event } from './../models/event';

@Injectable()
export class EventService {
  constructor(private http: HttpClient) {}

  errorHandler(error: HttpErrorResponse) {
    console.log('Event api error ', error);
    return throwError(error);
  }

  getAllEvents(page: number, size: number, sort: string): Observable<any> {
    return this.http
      .get<Event[]>(Constant.API_ENDPOINT + '/rest/events', {
        params: {
          page: page,
          size: size,
          sort: sort,
        },
      })
      .pipe(catchError(this.errorHandler));
  }

  getEventById(id: number): Observable<Event[]> {
    return this.http
      .get<Event[]>(`${Constant.API_ENDPOINT}/event/${id}`)
      .pipe(catchError(this.errorHandler));
  }

  createEvent(event: Event): Observable<Event[]> {
    return this.http
      .post<any>(`${Constant.API_ENDPOINT}/event`, event)
      .pipe(catchError(this.errorHandler));
  }

  updateEvent(event: Event): Observable<Event[]> {
    return this.http
      .put<any>(Constant.API_ENDPOINT + '/rest/events', event)
      .pipe(catchError(this.errorHandler));
  }

  getLeaveAndEventsBetweenDate(
    startDate: Date,
    endDate: Date
  ): Observable<any> {
    return this.http
      .get<Event[]>(Constant.API_ENDPOINT + '/rest/events/byDate', {
        params: {
          date1: startDate.toDateString(),
          date2: endDate.toDateString(),
        },
      })
      .pipe(catchError(this.errorHandler));
  }
}
