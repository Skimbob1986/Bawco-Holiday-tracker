import React, { useState, useEffect } from 'react';
import { Holiday, holidayAPI } from '../api';

interface HolidayFormProps {
  holiday?: Holiday;
  onSubmit: (holiday: Holiday) => void;
  onCancel: () => void;
}

export const HolidayForm: React.FC<HolidayFormProps> = ({ holiday, onSubmit, onCancel }) => {
  const [name, setName] = useState(holiday?.name || '');
  const [startDate, setStartDate] = useState(
    holiday?.startDate?.split('T')[0] || ''
  );
  const [endDate, setEndDate] = useState(holiday?.endDate?.split('T')[0] || '');
  const [description, setDescription] = useState(holiday?.description || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !startDate || !endDate) {
      setError('Name, start date, and end date are required');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date must be before end date');
      return;
    }

    setLoading(true);

    try {
      if (holiday) {
        const response = await holidayAPI.update(holiday.id, {
          name,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          description,
        });
        onSubmit(response.data);
      } else {
        const response = await holidayAPI.create({
          name,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          description,
        });
        onSubmit(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save holiday');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="holiday-form">
      <h3>{holiday ? 'Edit Holiday' : 'Add New Holiday'}</h3>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Holiday name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <div className="form-buttons">
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
