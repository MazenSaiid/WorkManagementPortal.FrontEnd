export interface ChangePasswordDto {
    email: string;
    oldPassword:string;
    newPassword:string;
  }
  export interface ResetPasswordDto {
    token:string;
    email: string;
    newPassword:string;
  }