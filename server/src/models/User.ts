import mongoose, { Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import type { IUser, UserType } from '@ems/shared';

// Extend IUser for Mongoose document
export interface IUserDocument extends Omit<IUser, '_id' | 'organizationId'>, Document {
  organizationId?: Types.ObjectId | null;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't include password in queries by default
    },
    userType: {
      type: String,
      enum: ['organizer', 'attendee'],
      required: [true, 'User type is required'],
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    phone: {
      type: String,
      trim: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      default: null,
      index: true,
    },
    organizerRole: {
      type: String,
      enum: ['admin', 'member', null],
      default: null,
    },
    customRoleLabel: {
      type: String,
      default: '',
      trim: true,
      maxlength: [50, 'Custom role label cannot exceed 50 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc: any, ret: any) => {
        ret._id = ret._id.toString();
        if (ret.organizationId) {
          ret.organizationId = ret.organizationId.toString();
        }
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Indexes for performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ userType: 1 });

export const User = mongoose.model<IUserDocument>('User', userSchema);

export default User;
