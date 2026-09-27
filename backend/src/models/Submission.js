const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    competitionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Competition', required: true, index: true },
    submittedAt: { type: Date, default: Date.now },
    fileUrl: { type: String, required: true },
    notes: { type: String, default: '' },
    status: { type: String, enum: ['SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED'], default: 'SUBMITTED' }
  },
  {
    timestamps: true
  }
);

// Prevent multiple active submissions per user per competition
SubmissionSchema.index({ userId: 1, competitionId: 1 }, { unique: true });

module.exports = mongoose.model('Submission', SubmissionSchema);
