export interface UserDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl: string;
}

export interface CreateUserDTO {
  firstName: string;
  lastName: string;
  email: string;
}

export interface JwtDecoded {
  sub: string;
  id: number;
  role: 'ADMIN' | 'USER';
  iat: number;
  exp: number;
}

export interface UserProfileDTO {
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
}

export interface MyProfileDTO extends UserProfileDTO {
  email: string;
}

export interface UpdateProfileRequestDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  profilePicture?: File;
}

export interface PasswordChangeRequestDTO {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}
