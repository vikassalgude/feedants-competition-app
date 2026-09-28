import { getApiBaseUrl } from './config';

export const fetchCompetitionDetails = async (id = 'default', userId = 'user_demo_1', simulatedNow = null) => {
  const baseUrl = getApiBaseUrl();
  let url = `${baseUrl}/competitions/${id}?userId=${encodeURIComponent(userId)}`;
  if (simulatedNow) {
    url += `&simulatedNow=${encodeURIComponent(simulatedNow)}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId
    }
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || 'Failed to fetch competition details');
  }
  return json.data;
};

export const registerUser = async (id, userId, simulatedNow = null) => {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/competitions/${id}/register`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId
    },
    body: JSON.stringify({ userId, simulatedNow })
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || 'Registration failed');
  }
  return json;
};

export const submitEntry = async (id, userId, fileUrl, notes = '', simulatedNow = null) => {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/competitions/${id}/submit`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId
    },
    body: JSON.stringify({ userId, fileUrl, notes, simulatedNow })
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || 'Submission failed');
  }
  return json;
};

export const seedDatabase = async () => {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/competitions/seed`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || 'Seeding failed');
  }
  return json;
};

export const setSpotsRemaining = async (id = 'default', spotsRemaining = 1) => {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/competitions/${id}/set-spots-left`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ spotsRemaining })
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || 'Setting spots failed');
  }
  return json;
};
