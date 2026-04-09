import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Organization from '../models/Organization';
import { AppError } from '../middleware/errorHandler';
import type { UserPublic, ApiResponse } from '@ems/shared';

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

// @desc    List all team members in the admin's organization
// @route   GET /api/users/team
// @access  Private (Organizer Admin only)
export const listTeamMembers = async (
  req: Request,
  res: Response<ApiResponse<UserPublic[]>>,
  next: NextFunction
): Promise<void> => {
  try {
    const organizationId = req.user!.organizationId;
    if (!organizationId) {
      throw new AppError('No organization attached to user', 400);
    }

    const members = await User.find({ organizationId }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: members.map(toUserPublic),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new team member
// @route   POST /api/users/team
// @access  Private (Organizer Admin only)
export const createTeamMember = async (
  req: Request,
  res: Response<ApiResponse<UserPublic>>,
  next: NextFunction
): Promise<void> => {
  try {
    const organizationId = req.user!.organizationId;
    if (!organizationId) {
      throw new AppError('No organization attached to user', 400);
    }

    const { firstName, lastName, email, password, organizerRole, phone, customRoleLabel } = req.body as {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      organizerRole?: 'admin' | 'member';
      phone?: string;
      customRoleLabel?: string;
    };

    if (!firstName || !lastName || !email || !password) {
      throw new AppError('firstName, lastName, email, and password are required', 400);
    }
    if (password.length < 8) {
      throw new AppError('Password must be at least 8 characters', 400);
    }

    // Validate customRoleLabel against the org's customRoles if provided
    if (customRoleLabel) {
      const org = await Organization.findById(organizationId);
      if (!org?.customRoles.includes(customRoleLabel)) {
        throw new AppError(
          `Custom role "${customRoleLabel}" is not defined for this organization`,
          400
        );
      }
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      throw new AppError('A user with this email already exists', 400);
    }

    const newMember = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      phone,
      userType: 'organizer',
      organizationId,
      organizerRole: organizerRole === 'admin' ? 'admin' : 'member',
      customRoleLabel: customRoleLabel ?? '',
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Team member created successfully',
      data: toUserPublic(newMember),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a team member (name, role, active status)
// @route   PUT /api/users/team/:id
// @access  Private (Organizer Admin only)
export const updateTeamMember = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<UserPublic>>,
  next: NextFunction
): Promise<void> => {
  try {
    const organizationId = req.user!.organizationId;
    if (!organizationId) {
      throw new AppError('No organization attached to user', 400);
    }

    const target = await User.findById(req.params.id);
    if (!target || target.organizationId?.toString() !== organizationId.toString()) {
      throw new AppError('Team member not found', 404);
    }

    // Protect the org owner from demotion/deactivation
    const org = await Organization.findById(organizationId);
    const isOwner = org?.ownerId.toString() === target._id.toString();

    const { firstName, lastName, phone, organizerRole, isActive, customRoleLabel } = req.body as {
      firstName?: string;
      lastName?: string;
      phone?: string;
      organizerRole?: 'admin' | 'member';
      isActive?: boolean;
      customRoleLabel?: string;
    };

    if (firstName !== undefined) target.firstName = firstName;
    if (lastName !== undefined) target.lastName = lastName;
    if (phone !== undefined) target.phone = phone;

    if (organizerRole !== undefined) {
      if (isOwner && organizerRole !== 'admin') {
        throw new AppError('Cannot demote the organization owner', 400);
      }
      target.organizerRole = organizerRole;
    }

    if (customRoleLabel !== undefined) {
      if (customRoleLabel && !org?.customRoles.includes(customRoleLabel)) {
        throw new AppError(
          `Custom role "${customRoleLabel}" is not defined for this organization`,
          400
        );
      }
      target.customRoleLabel = customRoleLabel;
    }

    if (isActive !== undefined) {
      if (isOwner && isActive === false) {
        throw new AppError('Cannot deactivate the organization owner', 400);
      }
      target.isActive = isActive;
    }

    await target.save();

    res.status(200).json({
      success: true,
      message: 'Team member updated successfully',
      data: toUserPublic(target),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset a team member's password
// @route   PATCH /api/users/team/:id/password
// @access  Private (Organizer Admin only)
export const resetTeamMemberPassword = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const organizationId = req.user!.organizationId;
    if (!organizationId) {
      throw new AppError('No organization attached to user', 400);
    }

    const { password } = req.body as { password: string };
    if (!password || password.length < 8) {
      throw new AppError('Password must be at least 8 characters', 400);
    }

    const target = await User.findById(req.params.id).select('+password');
    if (!target || target.organizationId?.toString() !== organizationId.toString()) {
      throw new AppError('Team member not found', 404);
    }

    target.password = password;
    await target.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a team member
// @route   DELETE /api/users/team/:id
// @access  Private (Organizer Admin only)
export const deleteTeamMember = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const organizationId = req.user!.organizationId;
    if (!organizationId) {
      throw new AppError('No organization attached to user', 400);
    }

    const target = await User.findById(req.params.id);
    if (!target || target.organizationId?.toString() !== organizationId.toString()) {
      throw new AppError('Team member not found', 404);
    }

    const org = await Organization.findById(organizationId);
    if (org?.ownerId.toString() === target._id.toString()) {
      throw new AppError('Cannot delete the organization owner', 400);
    }
    if (target._id.toString() === req.user!._id.toString()) {
      throw new AppError('You cannot delete your own account', 400);
    }

    await target.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Team member removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get the caller's organization (name + customRoles)
// @route   GET /api/users/team/organization
// @access  Private (Organizer Admin only)
export const getOrganization = async (
  req: Request,
  res: Response<ApiResponse<{ _id: string; name: string; ownerId: string; customRoles: string[] }>>,
  next: NextFunction
): Promise<void> => {
  try {
    const organizationId = req.user!.organizationId;
    if (!organizationId) {
      throw new AppError('No organization attached to user', 400);
    }
    const org = await Organization.findById(organizationId);
    if (!org) {
      throw new AppError('Organization not found', 404);
    }
    res.status(200).json({
      success: true,
      data: {
        _id: org._id.toString(),
        name: org.name,
        ownerId: org.ownerId.toString(),
        customRoles: org.customRoles ?? [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a custom role label to the organization
// @route   POST /api/users/team/custom-roles
// @access  Private (Organizer Admin only)
export const addCustomRole = async (
  req: Request,
  res: Response<ApiResponse<{ customRoles: string[] }>>,
  next: NextFunction
): Promise<void> => {
  try {
    const organizationId = req.user!.organizationId;
    if (!organizationId) {
      throw new AppError('No organization attached to user', 400);
    }

    const { label } = req.body as { label?: string };
    const trimmed = label?.trim();
    if (!trimmed) {
      throw new AppError('Role label is required', 400);
    }
    if (trimmed.length > 50) {
      throw new AppError('Role label cannot exceed 50 characters', 400);
    }
    if (['admin', 'member'].includes(trimmed.toLowerCase())) {
      throw new AppError('Cannot use a reserved role name', 400);
    }

    const org = await Organization.findById(organizationId);
    if (!org) {
      throw new AppError('Organization not found', 404);
    }

    if (org.customRoles.includes(trimmed)) {
      throw new AppError('A role with this label already exists', 400);
    }

    org.customRoles.push(trimmed);
    await org.save();

    res.status(200).json({
      success: true,
      message: 'Custom role added',
      data: { customRoles: org.customRoles },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a custom role label from the organization
// @route   DELETE /api/users/team/custom-roles/:label
// @access  Private (Organizer Admin only)
export const deleteCustomRole = async (
  req: Request<{ label: string }>,
  res: Response<ApiResponse<{ customRoles: string[] }>>,
  next: NextFunction
): Promise<void> => {
  try {
    const organizationId = req.user!.organizationId;
    if (!organizationId) {
      throw new AppError('No organization attached to user', 400);
    }

    const label = decodeURIComponent(req.params.label);

    const org = await Organization.findById(organizationId);
    if (!org) {
      throw new AppError('Organization not found', 404);
    }

    const before = org.customRoles.length;
    org.customRoles = org.customRoles.filter((r) => r !== label);
    if (org.customRoles.length === before) {
      throw new AppError(`Custom role "${label}" not found`, 404);
    }
    await org.save();

    // Clear this label from any users that had it
    await User.updateMany(
      { organizationId, customRoleLabel: label },
      { $set: { customRoleLabel: '' } }
    );

    res.status(200).json({
      success: true,
      message: 'Custom role deleted',
      data: { customRoles: org.customRoles },
    });
  } catch (error) {
    next(error);
  }
};
