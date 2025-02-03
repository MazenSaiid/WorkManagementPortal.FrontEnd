export interface RolesListDto {
    roleId: string;
    roleName: string;
    userCount: number;
  }
  export enum Roles {
    Admin =61, 
    Manager,
    Employee,
    Supervisor, 
    TeamLead
    // Add other shift types as needed
  }