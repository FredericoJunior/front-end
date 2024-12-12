export interface RegisterDto {
  name: string;
  login: string;
  password?: string;
  role: string;
}

export interface UserDto {
  id: number;
  name: string; //string(100)
  login: string; //string(50)
  password?: string; //string(100)
  role: string; //string(50)
  accessDisabled?: boolean;
  resetPassword?: boolean;
  createdAt?: string;
}

export interface UserRoleUpdateDto {
  id: number;
  role: string;
}
