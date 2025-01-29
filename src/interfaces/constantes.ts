import { environment } from "src/environments/environment";

export const PERSON_API: string = '/personApi.php';
export const  LOGIN_API: string =  '/loginApi.php';
export const  VALIDATION_API: string =  '/personApi.php/{0}/{1}';
export const  GETUSER_API: string =  '/personApi.php/{0}';

export const filterid:string = "ci_persona";
export const filtermail:string = "correo_persona";


export const getApiUrl = (endpoint: string): string => {
  return `${environment.API_BASE_URL}${[endpoint]}`;
};

export const formatUrl = (url: string, ...args: any[]): string => {
  return url.replace(/{(\d+)}/g, (match, index) => {
    const replacement = args[index];
    return replacement !== undefined ? replacement : match;
  });
};
