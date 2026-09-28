require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const http = require('http');
const connectDB = require('../src/config/db');
const Competition = require('../src/models/Competition');
const Registration = require('../src/models/Registration');
const Submission = require('../src/models/Submission');

// Helper function to send HTTP POST registration request
const makeRegisterRequest = (competitionId, userId) => {
  return new Promise((resolve) => {
    const postData = JSON.stringify({ userId });
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api/competitions/${competitionId}/register`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'x-user-id': userId
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ statusCode: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ statusCode: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ statusCode: 500, error: err.message });
    });

    req.write(postData);
    req.end();
  });
};

const runConcurrencyTests = async () => {
  console.log('================================================================');
  console.log('🧪 CONCURRENCY TEST SUITE: ATOMIC SPOT RESERVATION & RACE CONDITIONS');
  console.log('================================================================\n');

  await connectDB();

  // Reset database for clean isolated testing
  await Competition.deleteMany({});
  await Registration.deleteMany({});
  await Submission.deleteMany({});

  // 1. Create test competition with totalSpots: 20 and spotsBooked: 15 (EXACTLY 5 SPOTS REMAINING!)
  const comp = new Competition({
    title: 'Concurrency Test Championship',
    tags: ['Test', 'Concurrency'],
    certificateIncluded: true,
    prizePool: 5000,
    entryFee: 100,
    totalSpots: 20,
    spotsBooked: 15, // Exactly 5 spots left!
    judge: {
      name: 'Test Judge',
      title: 'Senior Auditor',
      experience: '10 Years',
      photoUrl: 'https://via.placeholder.com/150',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    registrationDeadline: new Date(Date.now() + 5 * 86400000),
    submissionStartsAt: new Date(Date.now() + 6 * 86400000),
    submissionEndsAt: new Date(Date.now() + 10 * 86400000),
    resultDate: new Date(Date.now() + 15 * 86400000),
    rewards: [{ position: '1st Winner', amount: 5000, iconType: 'trophy' }],
    aboutText: 'Concurrency testing competition.',
    judgingParameters: [{ title: 'Code Integrity', description: 'Atomic locks and race conditions.', weightage: 100 }],
    rulesAndEligibility: ['Testing only'],
    previousWinners: [],
    referralCode: 'test123'
  });
  await comp.save();

  console.log(`📌 Test Competition Created: "${comp.title}"`);
  console.log(`   Total Spots: ${comp.totalSpots} | Initial Spots Booked: ${comp.spotsBooked} | Remaining: 5 spots\n`);

  // ----------------------------------------------------------------
  // TEST 1: 30 Simultaneous Requests for 5 Remaining Spots
  // ----------------------------------------------------------------
  console.log('----------------------------------------------------------------');
  console.log('⚡ TEST 1: Firing 30 SIMULTANEOUS register requests (Promise.all)...');
  console.log('----------------------------------------------------------------');

  const userIds = Array.from({ length: 30 }, (_, i) => `user_concurrent_${i + 1}`);
  const requests = userIds.map(uid => makeRegisterRequest(comp._id.toString(), uid));

  const results = await Promise.all(requests);

  let successCount = 0;
  let conflict409Count = 0;
  let otherCount = 0;

  results.forEach((res, idx) => {
    if (res.statusCode === 201) {
      successCount++;
    } else if (res.statusCode === 409) {
      conflict409Count++;
    } else {
      otherCount++;
      console.warn(`  [Request ${idx + 1}] Unexpected status ${res.statusCode}:`, res.body);
    }
  });

  const updatedComp1 = await Competition.findById(comp._id);

  console.log(`✅ Successes (HTTP 201):    ${successCount} (Expected: 5)`);
  console.log(`🛑 Full Spots (HTTP 409):    ${conflict409Count} (Expected: 25)`);
  console.log(`❓ Other Status Codes:      ${otherCount} (Expected: 0)`);
  console.log(`📊 Final spotsBooked in DB:  ${updatedComp1.spotsBooked} / ${updatedComp1.totalSpots}`);
  
  const test1Passed = successCount === 5 && conflict409Count === 25 && updatedComp1.spotsBooked === 20;
  console.log(`🏆 TEST 1 RESULT:           ${test1Passed ? 'PASSED ✅' : 'FAILED ❌'}\n`);

  // ----------------------------------------------------------------
  // TEST 2: Same User Registering Twice Simultaneously
  // ----------------------------------------------------------------
  console.log('----------------------------------------------------------------');
  console.log('⚡ TEST 2: Firing 2 SIMULTANEOUS requests for the SAME USER ID...');
  console.log('----------------------------------------------------------------');

  // Reset competition to 0 spots booked for clean test
  await Registration.deleteMany({});
  await Competition.findByIdAndUpdate(comp._id, { spotsBooked: 0 });

  const sameUserId = 'user_duplicate_race_test';
  const duplicateRequests = [
    makeRegisterRequest(comp._id.toString(), sameUserId),
    makeRegisterRequest(comp._id.toString(), sameUserId)
  ];

  const dupResults = await Promise.all(duplicateRequests);

  let dupSuccessCount = 0;
  let dupBadRequestCount = 0;

  dupResults.forEach(res => {
    if (res.statusCode === 201) {
      dupSuccessCount++;
    } else if (res.statusCode === 400) {
      dupBadRequestCount++;
    }
  });

  const updatedComp2 = await Competition.findById(comp._id);

  console.log(`✅ Successes (HTTP 201):    ${dupSuccessCount} (Expected: 1)`);
  console.log(`🚫 Rejected (HTTP 400):     ${dupBadRequestCount} (Expected: 1)`);
  console.log(`📊 Final spotsBooked in DB:  ${updatedComp2.spotsBooked} (Expected: 1)`);

  const test2Passed = dupSuccessCount === 1 && dupBadRequestCount === 1 && updatedComp2.spotsBooked === 1;
  console.log(`🏆 TEST 2 RESULT:           ${test2Passed ? 'PASSED ✅' : 'FAILED ❌'}\n`);

  // Re-seed original sample competition so server stays in pristine state
  console.log('🔄 Re-seeding default competition data for server demo...');
  await Competition.deleteMany({});
  await Registration.deleteMany({});
  await Submission.deleteMany({});
  const competitionController = require('../src/controllers/competitionController');
  await competitionController.seedDatabase({ headers: {} }, { json: () => {}, status: () => ({ json: () => {} }) });
  console.log('✅ Server re-seeded successfully!\n');

  process.exit(0);
};

runConcurrencyTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
