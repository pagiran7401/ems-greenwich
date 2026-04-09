import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Organization from '../models/Organization';
import { generateToken } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import type { RegisterInput, LoginInput, AuthResponse, UserPublic, ApiResponse } from '@ems/shared';

// Build the public user response including org/role fields
const toUserPublic = (user: any): UserPublic => ({
  _id: user._id.toString(),
  email: user.email,
  userType: user.userType,
  firstName: user.firstName,
  lastName: user.lastName,
  phone: user.phone,
  organizationId: user.organizationId ? user.organizationId.toString() : null,
  organizerRole: user.organizerRole ?? null,
  customRoleLabel: user.customRoleLabel ?? '',
  isActive: user.isActive ?? true,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response<AuthResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, userType, firstName, lastName, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    // Create new user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      userType,
      firstName,
      lastName,
      phone,
      isActive: true,
    });

    // If registering as organizer, auto-create an Organization and make this user its admin
    if (userType === 'organizer') {
      const org = await Organization.create({
        name: `${firstName}'s Team`,
        ownerId: user._id,
      });
      user.organizationId = org._id;
      user.organizerRole = 'admin';
      await user.save();
    }

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: toUserPublic(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (
  req: Request<{}, {}, LoginInput>,
  res: Response<AuthResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Reject login if the account has been deactivated by an admin
    if (user.isActive === false) {
      throw new AppError('This account has been deactivated. Contact your organization admin.', 403);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: toUserPublic(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (
  _req: Request,
  res: Response<AuthResponse>,
  _next: NextFunction
): Promise<void> => {
  // JWT is stateless, logout is handled client-side
  // This endpoint exists for API completeness
  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (
  req: Request,
  res: Response<AuthResponse>,
  _next: NextFunction
): Promise<void> => {
  const user = req.user!;

  res.status(200).json({
    success: true,
    message: 'User retrieved successfully',
    user: toUserPublic(user),
  });
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (
  req: Request,
  res: Response<ApiResponse<UserPublic>>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { firstName, lastName, phone } = req.body;

    // Validate input
    if (!firstName || !lastName) {
      throw new AppError('First name and last name are required', 400);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, phone: phone || '' },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: toUserPublic(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError('Current password and new password are required', 400);
    }

    if (newPassword.length < 8) {
      throw new AppError('New password must be at least 8 characters', 400);
    }

    // Get user with password field
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new AppError('Current password is incorrect', 401);
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};
