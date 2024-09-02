interface LoginResponse {
  token(arg0: string, token: any): unknown;
  message: string;
  status: number | string;
  data: {employeeId: string | number};
}

interface LoginApiArgs {
  userID: string;
  password: string;
}



export type {LoginResponse, LoginApiArgs};
