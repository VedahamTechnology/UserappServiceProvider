import React from 'react';
import { View, Text } from 'react-native';
import { STATUS_COLORS } from '../../constants/colors';

const STATUS_LABELS = {
  pending: 'Pending',
  accepted: 'Accepted',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
  default: '',
};

const StatusBadge = ({ status, className = '' }) => {
  const key = STATUS_COLORS[status] ? status : 'default';
  const { fg, bg } = STATUS_COLORS[key];
  const label = STATUS_LABELS[status] || status || '';

  return (
    <View
      className={`px-3 py-1.5 rounded-xl ${className}`}
      style={{ backgroundColor: `${fg}1A` }} // 10% alpha
    >
      <Text
        className="font-bold text-[10px] uppercase tracking-wider"
        style={{ color: fg }}
      >
        {label}
      </Text>
    </View>
  );
};

export default StatusBadge;