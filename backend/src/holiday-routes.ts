import express, { Response } from 'express';
import prisma from './prisma-client.js';
import { authMiddleware, AuthRequest } from './middleware.js';

const router = express.Router();

interface HolidayBody {
  name: string;
  startDate: string;
  endDate: string;
  description?: string;
}

// Get all holidays for user
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const holidays = await prisma.holiday.findMany({
      where: { userId: req.userId },
      orderBy: { startDate: 'asc' },
    });
    res.json(holidays);
  } catch (error) {
    console.error('Get holidays error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single holiday
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const holiday = await prisma.holiday.findFirst({ where: { id: parseInt(id), userId: req.userId } });

    if (!holiday) {
      res.status(404).json({ error: 'Holiday not found' });
      return;
    }

    res.json(holiday);
  } catch (error) {
    console.error('Get holiday error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create holiday
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, startDate, endDate, description }: HolidayBody = req.body;

    if (!name || !startDate || !endDate) {
      res.status(400).json({ error: 'Name, startDate, and endDate are required' });
      return;
    }

    const holiday = await prisma.holiday.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        description,
        userId: req.userId!,
      },
    });

    res.status(201).json(holiday);
  } catch (error) {
    console.error('Create holiday error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update holiday
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, startDate, endDate, description }: HolidayBody = req.body;

    // Check ownership
    const existing = await prisma.holiday.findFirst({ where: { id: parseInt(id), userId: req.userId } });

    if (!existing) {
      res.status(404).json({ error: 'Holiday not found' });
      return;
    }
    const holiday = await prisma.holiday.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(description !== undefined && { description }),
      },
    });

    res.json(holiday);
  } catch (error) {
    console.error('Update holiday error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete holiday
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check ownership
    const existing = await prisma.holiday.findFirst({ where: { id: parseInt(id), userId: req.userId } });

    if (!existing) {
      res.status(404).json({ error: 'Holiday not found' });
      return;
    }
    await prisma.holiday.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Holiday deleted' });
  } catch (error) {
    console.error('Delete holiday error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
