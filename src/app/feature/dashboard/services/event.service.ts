import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Constant } from '../constant/constant';
import { LeaveType } from '../models/schemas/leave-type';
import { ApiResponse } from '../models/api-response';
import { DataTableConfiguration } from '../models/data-table-configuration';
import { DataTableResult } from '../models/data-table-result';
import { Event } from '../models/schemas/event';
import { CalendarEvent } from '../models/calendar-event';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private http: HttpClient) {}

  errorHandler(error: HttpErrorResponse) {
    console.log('Event api error ', error);
    return throwError(error);
  }

  getAllEvents(): Observable<ApiResponse<Event[]>> {
    return this.http
      .get<ApiResponse<Event[]>>(`${Constant.API_ENDPOINT}/event/get-events`)
      .pipe(catchError(this.errorHandler));
  }

  getAllEventsSsr(
    dataTableConfiguration: DataTableConfiguration
  ): Observable<ApiResponse<DataTableResult<Event>>> {
    return this.http
      .post<ApiResponse<DataTableResult<Event>>>(
        `${Constant.API_ENDPOINT}/event/get-events/ssr`,
        dataTableConfiguration
      )
      .pipe(catchError(this.errorHandler));
  }

  getEventById(id: number): Observable<ApiResponse<Event>> {
    return this.http
      .get<ApiResponse<Event>>(`${Constant.API_ENDPOINT}/event/${id}`)
      .pipe(catchError(this.errorHandler));
  }
  getEventsBetweenDate(
    startDate: string,
    endDate: string
  ): Observable<ApiResponse<CalendarEvent[]>> {
    return this.http
      .get<ApiResponse<CalendarEvent[]>>(
        `${Constant.API_ENDPOINT + '/event/get-events-between'}`,
        {
          params: {
            startDate,
            endDate,
          },
        }
      )
      .pipe(catchError(this.errorHandler));
  }

  createEvent(event: Event): Observable<ApiResponse<Event>> {
    return this.http
      .post<ApiResponse<Event>>(`${Constant.API_ENDPOINT}/event`, event)
      .pipe(catchError(this.errorHandler));
  }

  updateEvent(event: Event): Observable<ApiResponse<Event>> {
    return this.http
      .patch<ApiResponse<Event>>(`${Constant.API_ENDPOINT}/event`, event)
      .pipe(catchError(this.errorHandler));
  }

  deleteEvent(id: number): Observable<ApiResponse<Event>> {
    return this.http
      .delete<ApiResponse<Event>>(`${Constant.API_ENDPOINT}/event/${id}`)
      .pipe(catchError(this.errorHandler));
  }
}
