/**
 * Competition Lifecycle State Machine & CTA Calculator
 */

const PHASES = {
  OPEN_FOR_REGISTRATION: 'OPEN_FOR_REGISTRATION',
  REGISTRATION_CLOSED: 'REGISTRATION_CLOSED',
  SUBMISSION_OPEN: 'SUBMISSION_OPEN',
  SUBMISSION_CLOSED: 'SUBMISSION_CLOSED',
  RESULTS_DECLARED: 'RESULTS_DECLARED'
};

/**
 * Calculates the current lifecycle phase of a competition
 * @param {Object} competition - Competition document
 * @param {Date} referenceTime - Current date/time (or simulated date/time)
 * @returns {String} phase key
 */
const derivePhase = (competition, referenceTime = new Date()) => {
  const now = new Date(referenceTime).getTime();
  const regDeadline = new Date(competition.registrationDeadline).getTime();
  const subStart = new Date(competition.submissionStartsAt).getTime();
  const subEnd = new Date(competition.submissionEndsAt).getTime();
  const resDate = new Date(competition.resultDate).getTime();

  const isSpotsAvailable = competition.spotsBooked < competition.totalSpots;

  if (now >= resDate) {
    return PHASES.RESULTS_DECLARED;
  }

  if (now > subEnd && now < resDate) {
    return PHASES.SUBMISSION_CLOSED;
  }

  if (now >= subStart && now <= subEnd) {
    return PHASES.SUBMISSION_OPEN;
  }

  if (now < regDeadline && isSpotsAvailable) {
    return PHASES.OPEN_FOR_REGISTRATION;
  }

  // If before submissionStartsAt but after registrationDeadline or spots full
  if (now < subStart) {
    return PHASES.REGISTRATION_CLOSED;
  }

  return PHASES.REGISTRATION_CLOSED;
};

/**
 * Derives CTA button state, label, and action based on phase and user state
 */
const deriveCTAState = (phase, isRegistered, hasSubmitted, spotsBooked, totalSpots) => {
  const isFull = spotsBooked >= totalSpots;

  if (phase === PHASES.RESULTS_DECLARED) {
    return {
      label: 'Results Declared',
      enabled: false,
      action: 'VIEW_RESULTS',
      subtext: 'Check previous winners & rewards'
    };
  }

  if (phase === PHASES.SUBMISSION_CLOSED) {
    if (isRegistered && hasSubmitted) {
      return {
        label: 'Submitted',
        enabled: false,
        action: 'NONE',
        subtext: 'Evaluation in progress'
      };
    }
    return {
      label: 'Submission Closed',
      enabled: false,
      action: 'NONE',
      subtext: 'Judging in progress'
    };
  }

  if (phase === PHASES.SUBMISSION_OPEN) {
    if (!isRegistered) {
      return {
        label: 'Registration Closed',
        enabled: false,
        action: 'NONE',
        subtext: 'You did not register for this event'
      };
    }
    if (hasSubmitted) {
      return {
        label: 'Submitted',
        enabled: false,
        action: 'NONE',
        subtext: 'Your submission is recorded'
      };
    }
    return {
      label: 'Upload Submission',
      enabled: true,
      action: 'SUBMIT',
      subtext: 'Registered'
    };
  }

  if (phase === PHASES.REGISTRATION_CLOSED) {
    if (isRegistered) {
      return {
        label: 'Registered',
        enabled: false,
        action: 'NONE',
        subtext: 'Waiting for submission to start'
      };
    }
    return {
      label: 'Registration Closed',
      enabled: false,
      action: 'NONE',
      subtext: isFull ? 'All spots full' : 'Registration deadline passed'
    };
  }

  // Phase: OPEN_FOR_REGISTRATION
  if (isRegistered) {
    return {
      label: 'Registered',
      enabled: false,
      action: 'NONE',
      subtext: 'You are registered for this event'
    };
  }

  return {
    label: 'Register',
    enabled: true,
    action: 'REGISTER',
    subtext: `₹${totalSpots - spotsBooked} spots remaining`
  };
};

module.exports = {
  PHASES,
  derivePhase,
  deriveCTAState
};
