export interface UserProfileDTO {
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
}

export interface MyProfileDTO extends UserProfileDTO {
  email: string;
}
