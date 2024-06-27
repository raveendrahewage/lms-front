import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Constant } from '../constant/constant';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let apiRequest;
  if (inject(CookieService).get(Constant.TOKEN_COOKIE_NAME) != null) {
    apiRequest = tokenizeReq(req);
  } else {
    apiRequest = normalReq(req);
  }
  return next(apiRequest);
};

const tokenizeReq = (request: HttpRequest<any>) => {
  return request.clone({
    setHeaders: {
      Authorization:
        'Bearer ' + inject(CookieService).get(Constant.TOKEN_COOKIE_NAME),
    },
  });
};

const normalReq = (request: HttpRequest<any>) => {
  return request.clone({});
};
