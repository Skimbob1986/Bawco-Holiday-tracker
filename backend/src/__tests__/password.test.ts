import { hashPassword, verifyPassword } from '../password';

describe('Password Utils', () => {
  it('should hash a password', async () => {
    const password = 'test123';
    const hash = await hashPassword(password);
    expect(hash).not.toEqual(password);
    expect(hash.length).toBeGreaterThan(0);
  });

  it('should verify correct password', async () => {
    const password = 'test123';
    const hash = await hashPassword(password);
    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });

  it('should reject incorrect password', async () => {
    const password = 'test123';
    const hash = await hashPassword(password);
    const isValid = await verifyPassword('wrongpassword', hash);
    expect(isValid).toBe(false);
  });
});
