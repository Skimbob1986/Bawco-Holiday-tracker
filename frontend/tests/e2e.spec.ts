import { test, expect } from '@playwright/test';

test('register, login, create holiday flow', async ({ page, request }) => {
  const timestamp = Date.now();
  const email = `pw_${timestamp}@example.com`;
  const password = 'PwTest123!';

  // Visit app
  await page.goto('/');

  // Use API to register (faster and stable for E2E setup)
  const registerRes = await request.post('/api/auth/register', {
    data: { email, password }
  });
  expect(registerRes.ok()).toBeTruthy();
  const registerJson = await registerRes.json();
  expect(registerJson.user.email).toBe(email);

  // Login to get token
  const loginRes = await request.post('/api/auth/login', { data: { email, password } });
  expect(loginRes.ok()).toBeTruthy();
  const loginJson = await loginRes.json();
  const token = loginJson.token;
  expect(token).toBeTruthy();

  // Create holiday using API with token
  const createRes = await request.post('/api/holidays', {
    data: {
      name: 'Playwright Holiday',
      startDate: '2025-12-24',
      endDate: '2025-12-25',
      description: 'E2E test'
    },
    headers: { Authorization: `Bearer ${token}` }
  });
  expect(createRes.ok()).toBeTruthy();
  const created = await createRes.json();
  expect(created.name).toBe('Playwright Holiday');

  // Confirm holiday appears in list
  const listRes = await request.get('/api/holidays', { headers: { Authorization: `Bearer ${token}` } });
  expect(listRes.ok()).toBeTruthy();
  const list = await listRes.json();
  expect(Array.isArray(list)).toBeTruthy();
  expect(list.some((h: any) => h.name === 'Playwright Holiday')).toBeTruthy();
});
