import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'active' | 'suspended' | 'completed' | 'pending' | 'draft' | 'upcoming' | 'live';
  className?: string;
}

const statusConfig = {
  active: {
    label: 'Active',
    className: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  suspended: {
    label: 'Suspended',
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
  completed: {
    label: 'Completed',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  },
  pending: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  },
  draft: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  },
  upcoming: {
    label: 'Upcoming',
    className: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
  },
  live: {
    label: 'Live',
    className: 'bg-green-500 text-white hover:bg-green-500 animate-pulse',
  },
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge className={cn(config.className, className)} variant="secondary">
      {config.label}
    </Badge>
  );
}
