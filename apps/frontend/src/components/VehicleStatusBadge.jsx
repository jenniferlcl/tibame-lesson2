const STATUS_CONFIG = {
  available:   { label: '可用',   dot: 'bg-green-500',  bg: 'bg-green-50 text-green-700 border border-green-200' },
  in_use:      { label: '使用中', dot: 'bg-blue-500',   bg: 'bg-blue-50 text-blue-700 border border-blue-200' },
  maintenance: { label: '維修中', dot: 'bg-amber-500',  bg: 'bg-amber-50 text-amber-700 border border-amber-200' },
  retired:     { label: '報廢',   dot: 'bg-gray-400',   bg: 'bg-gray-50 text-gray-600 border border-gray-200' },
};

export function VehicleStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? { label: status, dot: 'bg-gray-400', bg: 'bg-gray-50 text-gray-600 border border-gray-200' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      {config.label}
    </span>
  );
}
