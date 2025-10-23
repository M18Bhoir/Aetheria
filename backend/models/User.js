import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please provide a name'], trim: true },
  userId: { type: String, required: [true, 'Please provide a userId'], unique: true, trim: true },
  password: { type: String, required: [true, 'Please provide a password'] },
  currentDues: {
    amount: { type: Number, default: 0 },
    dueDate: { type: Date },
    status: { type: String, enum: ['Pending', 'Paid', 'Overdue'], default: 'Pending' },
    lastUpdated: { type: Date, default: Date.now }
  }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
UserSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', UserSchema);
export default User;
