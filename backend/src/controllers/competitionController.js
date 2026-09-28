const Competition = require('../models/Competition');
const Registration = require('../models/Registration');
const Submission = require('../models/Submission');
const { derivePhase, deriveCTAState, PHASES } = require('../utils/lifecycle');

// Seed sample competition matching design reference
const seedSampleData = async () => {
  const existing = await Competition.findOne({ title: 'Feedants Classical Dance' });
  if (existing) {
    return existing;
  }

  const sampleComp = new Competition({
    title: 'Feedants Classical Dance',
    tags: ['Dance', 'Multi-Win'],
    certificateIncluded: true,
    prizePool: 1500,
    entryFee: 99,
    totalSpots: 20,
    spotsBooked: 1, // Matches 1/20 Booked in reference UI
    judge: {
      name: 'Manju Dubey',
      title: 'Professional Kathak Dancer',
      experience: '12+ Years of Experience',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    // Timestamps configured for standard lifecycle sequence
    registrationDeadline: new Date(Date.now() + 5 * 86400000),  // 5 days from now
    submissionStartsAt: new Date(Date.now() + 6 * 86400000),    // Starts 6 days from now
    submissionEndsAt: new Date(Date.now() + 10 * 86400000),     // Ends in 10 days
    resultDate: new Date(Date.now() + 15 * 86400000),           // Results in 15 days
    rewards: [
      { position: '1st Winner', amount: 550, iconType: 'trophy-gold' },
      { position: '2nd Winner', amount: 300, iconType: 'medal-silver' },
      { position: '3rd Winner', amount: 240, iconType: 'medal-bronze' },
      { position: '4th Winner', amount: 200, iconType: 'star' },
      { position: '5th Winner', amount: 130, iconType: 'star' },
      { position: '6th Winner', amount: 80, iconType: 'star' }
    ],
    aboutText: 'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.',
    judgingParameters: [
      { title: 'Expressions & Abhinaya', description: 'Facial expressions, eye movements, and storytelling clarity.', weightage: 30 },
      { title: 'Rhythm & Footwork (Taal)', description: 'Precision in timing, footwork control, and rhythm synchronization.', weightage: 30 },
      { title: 'Choreography & Grace', description: 'Fluidity of body movements, posture, and overall presentation.', weightage: 25 },
      { title: 'Costume & Presentation', description: 'Traditional attire appropriateness and aesthetic appeal.', weightage: 15 }
    ],
    rulesAndEligibility: [
      'Open to all age groups and skill levels.',
      'Video duration must be between 1 to 3 minutes.',
      'Performers must be dressed in authentic classical attire.',
      'Audio quality must be clear with no background noise distortion.',
      'Only entries uploaded within the submission window will be evaluated.'
    ],
    previousWinners: [
      {
        name: 'Riya Shah',
        rank: '1st Winner',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
      },
      {
        name: 'Aarav Mehta',
        rank: '1st Winner',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
      },
      {
        name: 'Neha Verma',
        rank: '2nd Winner',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
      },
      {
        name: 'Ishita Choudhury',
        rank: '3rd Winner',
        avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
      }
    ],
    referralCode: 'referral123'
  });

  await sampleComp.save();
  return sampleComp;
};

// GET /api/competitions
exports.getAllCompetitions = async (req, res) => {
  try {
    let comps = await Competition.find().lean();
    if (comps.length === 0) {
      const seeded = await seedSampleData();
      comps = [seeded];
    }
    res.json({ success: true, data: comps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/competitions/:id
exports.getCompetitionDetails = async (req, res) => {
  try {
    let { id } = req.params;
    const userId = req.headers['x-user-id'] || req.query.userId || 'user_demo_1';
    
    // Server ignores client simulatedNow unless ENABLE_DEMO_CONTROLS === 'true'
    const isDemoEnabled = process.env.ENABLE_DEMO_CONTROLS === 'true';
    const simulatedNow = (isDemoEnabled && req.query.simulatedNow) ? new Date(req.query.simulatedNow) : new Date();

    let competition;
    if (id === 'default' || !id) {
      competition = await Competition.findOne({ title: 'Feedants Classical Dance' });
      if (!competition) {
        competition = await seedSampleData();
      }
    } else {
      competition = await Competition.findById(id);
    }

    if (!competition) {
      return res.status(404).json({ success: false, message: 'Competition not found' });
    }

    // Check user registration
    const registration = await Registration.findOne({
      userId,
      competitionId: competition._id,
      status: 'REGISTERED'
    });

    const isRegistered = !!registration;

    // Check user submission
    const submission = await Submission.findOne({
      userId,
      competitionId: competition._id
    });

    const hasSubmitted = !!submission;

    // Calculate dynamic phase & CTA state server-side
    const phase = derivePhase(competition, simulatedNow);
    const ctaState = deriveCTAState(
      phase,
      isRegistered,
      hasSubmitted,
      competition.spotsBooked,
      competition.totalSpots
    );

    res.json({
      success: true,
      data: {
        competition,
        serverTime: simulatedNow,
        lifecycle: {
          phase,
          isRegistered,
          registeredAt: registration ? registration.registeredAt : null,
          hasSubmitted,
          submittedAt: submission ? submission.submittedAt : null,
          submissionDetails: submission || null,
          ctaState
        },
        currentUser: {
          userId
        }
      }
    });
  } catch (err) {
    console.error('Error fetching competition details:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/competitions/:id/register
// ATOMIC CONCURRENCY CHECK
exports.registerForCompetition = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] || req.body.userId || req.query.userId;
    const isDemoEnabled = process.env.ENABLE_DEMO_CONTROLS === 'true';
    const reqSimTime = req.body.simulatedNow || req.query.simulatedNow;
    const simulatedNow = (isDemoEnabled && reqSimTime) ? new Date(reqSimTime) : new Date();

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    let comp;
    if (id === 'default' || !id) {
      comp = await Competition.findOne({ title: 'Feedants Classical Dance' });
    } else {
      comp = await Competition.findById(id);
    }

    if (!comp) {
      return res.status(404).json({ success: false, message: 'Competition not found' });
    }

    // 1. Validate current phase
    const currentPhase = derivePhase(comp, simulatedNow);
    if (currentPhase !== PHASES.OPEN_FOR_REGISTRATION) {
      return res.status(400).json({
        success: false,
        message: `Registration is not open. Current phase is ${currentPhase}.`
      });
    }

    // 2. Insert Registration document FIRST.
    // MongoDB unique index on { userId: 1, competitionId: 1 } prevents duplicate registration atomically.
    let registration;
    try {
      registration = new Registration({
        userId,
        competitionId: comp._id,
        registeredAt: new Date(),
        status: 'REGISTERED'
      });
      await registration.save();
    } catch (dbErr) {
      if (dbErr.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'User is already registered for this competition'
        });
      }
      throw dbErr;
    }

    // 3. ATOMIC SPOT RESERVATION
    // Atomically find competition where spotsBooked < totalSpots and increment spotsBooked by 1
    const updatedComp = await Competition.findOneAndUpdate(
      {
        _id: comp._id,
        spotsBooked: { $lt: comp.totalSpots }
      },
      {
        $inc: { spotsBooked: 1 }
      },
      { new: true }
    );

    // 4. If spots were full, rollback the registration record and return 409 Conflict
    if (!updatedComp) {
      await Registration.deleteOne({ _id: registration._id });
      return res.status(409).json({
        success: false,
        message: 'Registration failed: Competition is fully booked or unavailable!'
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: {
        registration,
        updatedSpotsBooked: updatedComp.spotsBooked,
        totalSpots: updatedComp.totalSpots
      }
    });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/competitions/:id/submit
exports.submitEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] || req.body.userId;
    const { fileUrl, notes } = req.body;
    const isDemoEnabled = process.env.ENABLE_DEMO_CONTROLS === 'true';
    const simulatedNow = (isDemoEnabled && req.body.simulatedNow) ? new Date(req.body.simulatedNow) : new Date();

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    if (!fileUrl) {
      return res.status(400).json({ success: false, message: 'Submission file URL or content is required' });
    }

    let comp;
    if (id === 'default' || !id) {
      comp = await Competition.findOne({ title: 'Feedants Classical Dance' });
    } else {
      comp = await Competition.findById(id);
    }

    if (!comp) {
      return res.status(404).json({ success: false, message: 'Competition not found' });
    }

    // 1. Verify user registration
    const registration = await Registration.findOne({
      userId,
      competitionId: comp._id,
      status: 'REGISTERED'
    });

    if (!registration) {
      return res.status(403).json({
        success: false,
        message: 'Only registered users can submit entries for this competition'
      });
    }

    // 2. Verify lifecycle phase is SUBMISSION_OPEN
    const phase = derivePhase(comp, simulatedNow);
    if (phase !== PHASES.SUBMISSION_OPEN) {
      return res.status(400).json({
        success: false,
        message: `Submission window is currently closed. Current phase is ${phase}.`
      });
    }

    // 3. Verify user hasn't already submitted
    const existingSubmission = await Submission.findOne({
      userId,
      competitionId: comp._id
    });

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an entry for this competition'
      });
    }

    // 4. Save submission
    const submission = new Submission({
      userId,
      competitionId: comp._id,
      fileUrl,
      notes: notes || '',
      submittedAt: new Date()
    });

    await submission.save();

    res.status(201).json({
      success: true,
      message: 'Submission uploaded successfully!',
      data: submission
    });
  } catch (err) {
    console.error('Error during submission:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/competitions/:id/set-spots-left
exports.setSpotsLeft = async (req, res) => {
  try {
    if (process.env.ENABLE_DEMO_CONTROLS !== 'true') {
      return res.status(403).json({ success: false, message: 'Demo controls disabled' });
    }
    const { id } = req.params;
    const spotsRemaining = req.body.spotsRemaining !== undefined ? Number(req.body.spotsRemaining) : 1;

    let comp;
    if (id === 'default' || !id) {
      comp = await Competition.findOne({ title: 'Feedants Classical Dance' });
    } else {
      comp = await Competition.findById(id);
    }

    if (!comp) {
      return res.status(404).json({ success: false, message: 'Competition not found' });
    }

    comp.spotsBooked = Math.max(0, comp.totalSpots - spotsRemaining);
    await comp.save();

    // Clear registrations so test users can compete for the remaining spot
    await Registration.deleteMany({ competitionId: comp._id });

    res.json({
      success: true,
      message: `Competition updated to ${spotsRemaining} spot(s) remaining!`,
      data: {
        spotsBooked: comp.spotsBooked,
        totalSpots: comp.totalSpots,
        spotsRemaining
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/seed
exports.seedDatabase = async (req, res) => {
  try {
    await Competition.deleteMany({});
    await Registration.deleteMany({});
    await Submission.deleteMany({});
    const seededComp = await seedSampleData();

    res.json({
      success: true,
      message: 'Database seeded successfully with sample competition!',
      data: seededComp
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
