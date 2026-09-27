const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    competitionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Competition', required: true, index: true },
    registeredAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['REGISTERED', 'CANCELLED'], default: 'REGISTERED' }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate registration per user per competition
RegistrationSchema.index({ userId: 1, competitionId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', RegistrationSchema);
