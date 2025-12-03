import fs from 'fs';
import path from 'path';

const DATA_FILE = path.resolve(process.cwd(), 'backend', 'data.json');

type User = {
  id: number;
  email: string;
  name?: string;
  password: string;
  createdAt: string;
  updatedAt: string;
};

type Holiday = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  description?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

type DB = {
  users: User[];
  holidays: Holiday[];
};

function ensureDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    const initial: DB = { users: [], holidays: [] };
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
  }
}

function readDB(): DB {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(raw) as DB;
}

function writeDB(db: DB) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

export function getUserByEmail(email: string) {
  const db = readDB();
  return db.users.find(u => u.email === email) || null;
}

export function createUser(email: string, name: string | undefined, password: string) {
  const db = readDB();
  const id = db.users.length ? Math.max(...db.users.map(u => u.id)) + 1 : 1;
  const now = new Date().toISOString();
  const user: User = { id, email, name, password, createdAt: now, updatedAt: now };
  db.users.push(user);
  writeDB(db);
  return user;
}

export function getHolidaysByUser(userId: number) {
  const db = readDB();
  return db.holidays.filter(h => h.userId === userId);
}

export function getHolidayById(id: number, userId: number) {
  const db = readDB();
  return db.holidays.find(h => h.id === id && h.userId === userId) || null;
}

export function createHoliday(data: { name: string; startDate: string; endDate: string; description?: string; userId: number }) {
  const db = readDB();
  const id = db.holidays.length ? Math.max(...db.holidays.map(h => h.id)) + 1 : 1;
  const now = new Date().toISOString();
  const holiday: Holiday = { id, name: data.name, startDate: data.startDate, endDate: data.endDate, description: data.description, userId: data.userId, createdAt: now, updatedAt: now };
  db.holidays.push(holiday);
  writeDB(db);
  return holiday;
}

export function updateHoliday(id: number, userId: number, changes: Partial<Omit<Holiday, 'id' | 'userId'>>) {
  const db = readDB();
  const idx = db.holidays.findIndex(h => h.id === id && h.userId === userId);
  if (idx === -1) return null;
  const existing = db.holidays[idx];
  const updated = { ...existing, ...changes, updatedAt: new Date().toISOString() } as Holiday;
  db.holidays[idx] = updated;
  writeDB(db);
  return updated;
}

export function deleteHoliday(id: number, userId: number) {
  const db = readDB();
  const idx = db.holidays.findIndex(h => h.id === id && h.userId === userId);
  if (idx === -1) return false;
  db.holidays.splice(idx, 1);
  writeDB(db);
  return true;
}
