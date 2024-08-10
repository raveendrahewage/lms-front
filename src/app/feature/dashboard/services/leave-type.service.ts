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
import { LeaveAvailability } from '../models/schemas/leave-availability';

@Injectable({
  providedIn: 'root',
})
export class LeaveTypeService {
  constructor(private http: HttpClient) {}

  errorHandler(error: HttpErrorResponse) {
    console.log('LeaveType api error ', error);
    return throwError(error);
  }

  getAllLeaveTypes(): Observable<ApiResponse<LeaveType[]>> {
    return this.http
      .get<ApiResponse<LeaveType[]>>(
        `${Constant.API_ENDPOINT}/leave-type/get-leave-types`
      )
      .pipe(catchError(this.errorHandler));
  }
  getLeaveTypesForEmployee(id: number): Observable<ApiResponse<LeaveType[]>> {
    return this.http
      .get<ApiResponse<LeaveType[]>>(
        `${Constant.API_ENDPOINT}/leave-type/get-leave-types-for-employee/${id}`
      )
      .pipe(catchError(this.errorHandler));
  }

  getAllLeaveTypesSsr(
    dataTableConfiguration: DataTableConfiguration
  ): Observable<ApiResponse<DataTableResult<LeaveType>>> {
    return this.http
      .post<ApiResponse<DataTableResult<LeaveType>>>(
        `${Constant.API_ENDPOINT}/leave-type/get-leave-types/ssr`,
        dataTableConfiguration
      )
      .pipe(catchError(this.errorHandler));
  }

  getLeaveTypeById(id: number): Observable<ApiResponse<LeaveType>> {
    return this.http
      .get<ApiResponse<LeaveType>>(`${Constant.API_ENDPOINT}/leave-type/${id}`)
      .pipe(catchError(this.errorHandler));
  }

  createLeaveType(leaveType: LeaveType): Observable<ApiResponse<LeaveType>> {
    return this.http
      .post<ApiResponse<LeaveType>>(
        `${Constant.API_ENDPOINT}/leave-type`,
        leaveType
      )
      .pipe(catchError(this.errorHandler));
  }

  updateLeaveType(leaveType: LeaveType): Observable<ApiResponse<LeaveType>> {
    return this.http
      .patch<ApiResponse<LeaveType>>(
        `${Constant.API_ENDPOINT}/leave-type`,
        leaveType
      )
      .pipe(catchError(this.errorHandler));
  }

  deleteLeaveType(id: number): Observable<ApiResponse<LeaveType>> {
    return this.http
      .delete<ApiResponse<LeaveType>>(
        `${Constant.API_ENDPOINT}/leave-type/${id}`
      )
      .pipe(catchError(this.errorHandler));
  }
}
