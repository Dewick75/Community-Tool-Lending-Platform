import mongoose, { Schema } from 'mongoose';

const toolSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Power Tools',
        'Hand Tools',
        'Garden Tools',
        'Automotive',
        'Construction',
        'Electrical',
        'Plumbing',
        'Cleaning',
        'Kitchen Appliances',
        'Sports & Recreation',
        'Other'
      ],
      default: 'Other'
    },
    condition: {
      type: String,
      enum: ['Excellent', 'Good', 'Fair', 'Poor'],
      default: 'Good'
    },
    location: {
      city: {
        type: String,
        required: true,
        trim: true,
      },
      area: {
        type: String,
        required: true,
        trim: true,
      },
      postalCode: {
        type: String,
        trim: true,
      }
    },
    owner: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        trim: true,
      }
    },
    availability: {
      type: String,
      enum: ['available', 'borrowed', 'maintenance', 'unavailable'],
      default: 'available'
    },
    borrowingTerms: {
      maxDuration: {
        type: Number, // in days
        default: 7
      },
      deposit: {
        type: Number,
        default: 0
      },
      instructions: {
        type: String,
        trim: true,
      }
    },
    images: [{
      type: String, // URLs to images
    }],
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    // Legacy status field for backward compatibility
    status: {
      type: String,
      default: 'available',
    }
  },
  {
    timestamps: true,
  }
);

// Create indexes for better search performance
toolSchema.index({ name: 'text', description: 'text', tags: 'text' });
toolSchema.index({ category: 1 });
toolSchema.index({ 'location.city': 1 });
toolSchema.index({ availability: 1 });
toolSchema.index({ 'owner.email': 1 });

const Tool = mongoose.models.Tool || mongoose.model("Tool", toolSchema);

export default Tool;