import React from 'react';

const StatCard = ({ title, value, description, icon: Icon, color = 'indigo' }) => {
  return (
    <div className="stat-card">
      <div className="stat-content">
        <h3>{title}</h3>
        <div className="stat-number">{value}</div>
        {description && <div className="stat-desc">{description}</div>}
      </div>
      {Icon && (
        <div className={`stat-icon ${color}`}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
