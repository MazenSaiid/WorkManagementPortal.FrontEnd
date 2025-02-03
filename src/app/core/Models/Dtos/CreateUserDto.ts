export interface CreateUserDto {
    id: string;
    employeeSerialNumber:number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    supervisorId: string; 
    teamLeaderId: string;
    roleName: string;
  }