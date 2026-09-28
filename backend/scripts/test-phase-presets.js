const http = require('http');

const presets = [
  { name: 'Preset 1: Registration Open', offsetDays: 0, expectedPhase: 'OPEN_FOR_REGISTRATION' },
  { name: 'Preset 2: Registration Closed', offsetDays: 5.5, expectedPhase: 'REGISTRATION_CLOSED' },
  { name: 'Preset 3: Submission Open', offsetDays: 7, expectedPhase: 'SUBMISSION_OPEN' },
  { name: 'Preset 4: Submission Closed', offsetDays: 12, expectedPhase: 'SUBMISSION_CLOSED' },
  { name: 'Preset 5: Results Declared', offsetDays: 16, expectedPhase: 'RESULTS_DECLARED' }
];

const fetchPhase = (offsetDays) => {
  return new Promise((resolve, reject) => {
    const simulatedNow = new Date(Date.now() + offsetDays * 86400000).toISOString();
    const url = `http://localhost:5000/api/competitions/default?userId=user_demo_1&simulatedNow=${encodeURIComponent(simulatedNow)}`;

    http.get(url, (res) => {
      let rawData = '';
      res.on('data', chunk => rawData += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(rawData);
          resolve(parsed.data.lifecycle.phase);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
};

const runTest = async () => {
  console.log('================================================================');
  console.log('🔍 TESTING ALL 5 EVALUATOR CONTROL PRESETS AGAINST BACKEND API');
  console.log('================================================================\n');

  for (const p of presets) {
    const phase = await fetchPhase(p.offsetDays);
    const pass = phase === p.expectedPhase ? '✅ MATCH' : '❌ MISMATCH';
    console.log(`[${p.name}]`);
    console.log(`  Offset Days:    +${p.offsetDays} days`);
    console.log(`  Server Phase:   ${phase}`);
    console.log(`  Expected Phase: ${p.expectedPhase}`);
    console.log(`  Result:         ${pass}\n`);
  }
};

runTest().catch(console.error);
