import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOrganizationDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  ownerId: Types.ObjectId;
  customRoles: string[];
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema<IOrganizationDocument>(
  {
    name: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
      maxlength: [100, 'Organization name cannot exceed 100 characters'],
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner ID is required'],
      index: true,
    },
    customRoles: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc: any, ret: any) => {
        ret._id = ret._id.toString();
        ret.ownerId = ret.ownerId.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Organization = mongoose.model<IOrganizationDocument>('Organization', organizationSchema);

export default Organization;
