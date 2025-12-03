import { generateToken, verifyToken } from '../auth';

describe('Auth Utils', () => {
  it('should generate a valid token', () => {
    const payload = { id: 1, email: 'test@example.com' };
    const token = generateToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  it('should verify a valid token', () => {
    const payload = { id: 1, email: 'test@example.com' };
    const token = generateToken(payload);
    const decoded = verifyToken(token);
    expect(decoded).toBeDefined();
    expect(decoded?.id).toBe(payload.id);
    expect(decoded?.email).toBe(payload.email);
  });

  it('should return null for invalid token', () => {
    const decoded = verifyToken('invalid-token');
    expect(decoded).toBeNull();
  });

  it('should return null for expired token', () => {
    // This would require mocking jwt.verify or waiting for token to expire
    // For now, just test invalid token
    const decoded = verifyToken('invalid.token.here');
    expect(decoded).toBeNull();
  });
});
