const mongoose = require('mongoose');

const RewardSchema = new mongoose.Schema({
  position: { type: String, required: true },
  amount: { type: Number, required: true },
  iconType: { type: String, default: 'trophy' }
});

const JudgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  experience: { type: String, required: true },
  videoUrl: { type: String, default: '' },
  photoUrl: { type: String, default: '' }
});

const JudgingParameterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  weightage: { type: Number, default: 0 }
});

const WinnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rank: { type: String, required: true },
  avatarUrl: { type: String, default: '' },
  videoUrl: { type: String, default: '' }
});

const CompetitionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    tags: [{ type: String }],
    certificateIncluded: { type: Boolean, default: true },
    prizePool: { type: Number, required: true, min: 0 },
    entryFee: { type: Number, required: true, min: 0 },
    totalSpots: { type: Number, required: true, min: 1 },
    spotsBooked: { type: Number, default: 0, min: 0 },
    judge: { type: JudgeSchema, required: true },
    registrationDeadline: { type: Date, required: true },
    submissionStartsAt: { type: Date, required: true },
    submissionEndsAt: { type: Date, required: true },
    resultDate: { type: Date, required: true },
    rewards: [RewardSchema],
    aboutText: { type: String, required: true },
    judgingParameters: [JudgingParameterSchema],
    rulesAndEligibility: [{ type: String }],
    previousWinners: [WinnerSchema],
    referralCode: { type: String, default: 'referral123' }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Competition', CompetitionSchema);
