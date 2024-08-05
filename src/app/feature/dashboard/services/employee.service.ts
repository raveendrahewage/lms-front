import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Constant } from './../constant/constant';
import { SystemUser } from '../models/schemas/system-user';
import { SystemUserListItem } from '../models/system-user-list-item';
import { NewSystemUser } from '../models/new-system-user';
import { ApiResponse } from '../models/api-response';
import { ResetPasswordFormData } from '../models/forms';
import { AuthService } from '../auth/auth.service';
import { SortMode } from '../constant/sort-mode';
import { DataTableConfiguration } from '../models/data-table-configuration';
import { DataTableResult } from '../models/data-table-result';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  errorHandler(error: any) {
    console.log('Employee api error ', error);
    return throwError(error);
  }

  getAllEmployeesSsr(
    dataTableConfiguration: DataTableConfiguration
  ): Observable<ApiResponse<DataTableResult<SystemUserListItem>>> {
    return this.http
      .post<ApiResponse<DataTableResult<SystemUserListItem>>>(
        `${Constant.API_ENDPOINT}/employee/get-employees-ssr`,
        dataTableConfiguration
      )
      .pipe(catchError(this.errorHandler));
  }

  getAllEmployees(): Observable<ApiResponse<SystemUser[]>> {
    return this.http
      .get<ApiResponse<SystemUser[]>>(
        `${Constant.API_ENDPOINT}/employee/get-employees`
      )
      .pipe(catchError(this.errorHandler));
  }

  getEmployeeById(id: number): Observable<ApiResponse<SystemUser>> {
    return this.http
      .get<ApiResponse<SystemUser>>(`${Constant.API_ENDPOINT}/employee/${id}`)
      .pipe(catchError(this.errorHandler));
  }

  createEmployee(employee: NewSystemUser): Observable<ApiResponse<SystemUser>> {
    return this.http
      .post<ApiResponse<SystemUser>>(
        `${Constant.API_ENDPOINT}/employee`,
        employee
      )
      .pipe(catchError(this.errorHandler));
  }

  updateEmployee(employee: SystemUser): Observable<ApiResponse<SystemUser>> {
    return this.http
      .patch<ApiResponse<SystemUser>>(
        `${Constant.API_ENDPOINT}/employee`,
        employee
      )
      .pipe(catchError(this.errorHandler));
  }
  updateCurrentEmployee(
    employee: SystemUser
  ): Observable<ApiResponse<SystemUser>> {
    return this.http
      .patch<ApiResponse<SystemUser>>(
        `${Constant.API_ENDPOINT}/employee`,
        employee
      )
      .pipe(
        tap((response) => {
          this.authService.setCurrentSystemUser(response.data, null);
        }),
        catchError(this.errorHandler)
      );
  }

  inactivateEmployee(id: number): Observable<ApiResponse<SystemUser>> {
    return this.http
      .get<ApiResponse<SystemUser>>(
        `${Constant.API_ENDPOINT}/inactivate-system-user/${id}`
      )
      .pipe(catchError(this.errorHandler));
  }

  getEmployeeUnderSupervision(
    id: number
  ): Observable<ApiResponse<SystemUser[]>> {
    return this.http
      .get<ApiResponse<SystemUser[]>>(
        `${Constant.API_ENDPOINT}/employee/get-employees-under-supervision/${id}`
      )
      .pipe(catchError(this.errorHandler));
  }

  getEmployeeByFullName(fullName: string): Observable<ApiResponse<SystemUser>> {
    return this.http
      .get<ApiResponse<SystemUser>>(
        `${Constant.API_ENDPOINT}/employee/get-employee-by-full-name/${fullName}}`
      )
      .pipe(catchError(this.errorHandler));
  }

  resetPassword(
    resetPasswordFormDate: ResetPasswordFormData
  ): Observable<ApiResponse<SystemUser>> {
    return this.http
      .post<ApiResponse<SystemUser>>(
        `${Constant.API_ENDPOINT}/account/reset-password`,
        resetPasswordFormDate
      )
      .pipe(catchError(this.errorHandler));
  }

  getCurrentEmployee(): Observable<ApiResponse<SystemUser>> {
    return this.http
      .get<ApiResponse<SystemUser>>(
        `${Constant.API_ENDPOINT}/account/get-logged-in-system-user`
      )
      .pipe(catchError(this.errorHandler));
  }
}
