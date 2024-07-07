import { environment } from '../../../../environments/environment';

export class Constant {
  public static API_ENDPOINT = environment.apiUrl;
  public static HOLIDAY_API_ENDPOINT = environment.holidayApiUrl;
  public static SYSTEM_USER_COOKIE_NAME = 'systemUser';
  public static TOKEN_COOKIE_NAME = 'token';
}
