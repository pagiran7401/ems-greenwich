// User Types - Shared across client and server

export type UserType = 'organizer' | 'attendee';

export interface IUser {
  _id: string;
  email: string;
  password?: string; // Never sent to client
  userType: UserType;
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

// User without sensitive data (for client)
export type UserPublic = Omit<IUser, 'password'>;

// Registration payload
export interface RegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
  userType: UserType;
  firstName: string;
  lastName: string;
  phone?: string;
}

// Login payload
export interface LoginPayload {
  email: string;
  password: string;
}

// Auth response
export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: UserPublic;
}
