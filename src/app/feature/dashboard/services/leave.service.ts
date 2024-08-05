import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Constant } from '../constant/constant';
import { Leave } from '../models/schemas/leave';
import { LeaveListItem } from '../models/leave-list-item';
import { DataTableConfiguration } from '../models/data-table-configuration';
import { LeaveFetchingMode } from '../constant/leave';
import { DataTableResult } from '../models/data-table-result';
import { ApiResponse } from '../models/api-response';
import { LeaveReportItem } from '../models/leave-report-item';

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  constructor(private http: HttpClient) {}

  errorHandler(error: HttpErrorResponse) {
    console.log('Leave api error ', error);
    return throwError(error);
  }

  getAllLeavesSsr(
    dataTableConfiguration: DataTableConfiguration
  ): Observable<ApiResponse<DataTableResult<LeaveListItem>>> {
    return this.http
      .post<ApiResponse<DataTableResult<LeaveListItem>>>(
        `${Constant.API_ENDPOINT}/leave/get-all-leaves/ssr`,
        dataTableConfiguration
      )
      .pipe(catchError(this.errorHandler));
  }
  getLeavesByEmployeeIdSsr(
    id: number,
    leaveFetchingMode: LeaveFetchingMode,
    dataTableConfiguration: DataTableConfiguration
  ): Observable<ApiResponse<DataTableResult<LeaveListItem>>> {
    return this.http
      .post<ApiResponse<DataTableResult<LeaveListItem>>>(
        `${Constant.API_ENDPOINT}/leave/get-leaves-by-employee-id-ssr/${id}/${leaveFetchingMode}`,
        dataTableConfiguration
      )
      .pipe(catchError(this.errorHandler));
  }
  getLeavesById(id: number): Observable<ApiResponse<Leave>> {
    return this.http
      .get<ApiResponse<Leave>>(`${Constant.API_ENDPOINT}/leave/${id}`)
      .pipe(catchError(this.errorHandler));
  }

  createLeave(leave: Leave): Observable<ApiResponse<Leave>> {
    return this.http
      .post<ApiResponse<Leave>>(`${Constant.API_ENDPOINT}/leave`, leave)
      .pipe(catchError(this.errorHandler));
  }

  updateLeave(leave: Leave): Observable<ApiResponse<Leave>> {
    return this.http
      .patch<ApiResponse<Leave>>(`${Constant.API_ENDPOINT}/leave`, leave)
      .pipe(catchError(this.errorHandler));
  }

  approveEmployeeLeave(leave: Leave): Observable<Leave> {
    return this.http
      .put<Leave>(`${Constant.API_ENDPOINT}/leave`, leave)
      .pipe(catchError(this.errorHandler));
  }

  getEmployeeLeavesBetweenDate(
    startDate: string,
    endDate: string
  ): Observable<Leave[]> {
    return this.http
      .get<Leave[]>(`${Constant.API_ENDPOINT + '/leave/get-leaves-between'}`, {
        params: {
          startDate,
          endDate,
        },
      })
      .pipe(catchError(this.errorHandler));
  }
  getLeaveReport(): Observable<ApiResponse<LeaveReportItem[]>> {
    return this.http
      .get<ApiResponse<LeaveReportItem[]>>(
        `${Constant.API_ENDPOINT + '/leave/generate-leave-report'}`
      )
      .pipe(catchError(this.errorHandler));
  }
}
