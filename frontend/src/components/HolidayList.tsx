import React from 'react';
import { Holiday, holidayAPI } from '../api';

interface HolidayListProps {
  holidays: Holiday[];
  onEdit: (holiday: Holiday) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

export const HolidayList: React.FC<HolidayListProps> = ({
  holidays,
  onEdit,
  onDelete,
  loading,
}) => {
  if (loading) {
    return <div className="loading">Loading holidays...</div>;
  }

  if (holidays.length === 0) {
    return <div className="empty">No holidays tracked yet. Add one to get started!</div>;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <div className="holiday-list">
      {holidays.map((holiday) => (
        <div key={holiday.id} className="holiday-card">
          <div className="holiday-header">
            <h3>{holiday.name}</h3>
            <span className="days-badge">
              {calculateDays(holiday.startDate, holiday.endDate)} days
            </span>
          </div>
          <p className="dates">
            {formatDate(holiday.startDate)} - {formatDate(holiday.endDate)}
          </p>
          {holiday.description && <p className="description">{holiday.description}</p>}
          <div className="holiday-actions">
            <button className="btn-edit" onClick={() => onEdit(holiday)}>
              Edit
            </button>
            <button className="btn-delete" onClick={() => onDelete(holiday.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
