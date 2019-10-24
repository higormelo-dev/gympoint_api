import mongoose from 'mongoose';

const NotificationStudentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    student: {
      type: Number,
      required: true,
    },
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('NotificationStudent', NotificationStudentSchema);
