export interface UserDto {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    phoneNumber: string;
    supervisorId: string;
    supervisor?: UserDto;  // Supervisor is now a UserDto, not just an ID
    teamLeaderId: string;
    teamLeader?: UserDto;  // Team Leader is now a UserDto, not just an ID
    roleName: string;
  }