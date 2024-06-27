import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Constant } from '../constant/constant';
import { LeaveType } from '../models/leave-type';
import { ApiResponse } from '../models/api-response';
import { DataTableConfiguration } from '../models/data-table-configuration';
import { DataTableResult } from '../models/data-table-result';

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
      .get<ApiResponse<LeaveType[]>>(`${Constant.API_ENDPOINT}/leave-type`)
      .pipe(catchError(this.errorHandler));
  }

  getAllLeaveTypesSsr(
    dataTableConfiguration: DataTableConfiguration
  ): Observable<ApiResponse<DataTableResult<LeaveType>>> {
    return this.http
      .post<ApiResponse<DataTableResult<LeaveType>>>(
        `${Constant.API_ENDPOINT}/get-leave-types/ssr`,
        dataTableConfiguration
      )
      .pipe(catchError(this.errorHandler));
  }

  getLeaveTypeById(id: number): Observable<ApiResponse<LeaveType>> {
    return this.http
      .get<ApiResponse<LeaveType>>(`${Constant.API_ENDPOINT}/leave-type/${id}`)
      .pipe(catchError(this.errorHandler));
  }

  getLeaveTypeByUserId(id: number): Observable<ApiResponse<LeaveType[]>> {
    return this.http
      .get<ApiResponse<LeaveType[]>>(
        `${Constant.API_ENDPOINT}/leave-type/user/${id}`
      )
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
      .put<ApiResponse<LeaveType>>(
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

  searchByLeaveType(typeName: string): Observable<ApiResponse<LeaveType[]>> {
    return this.http
      .get<ApiResponse<LeaveType[]>>(
        `${Constant.API_ENDPOINT}/leave-type/get-leave-type-by-name/${typeName}`
      )
      .pipe(catchError(this.errorHandler));
  }
}
