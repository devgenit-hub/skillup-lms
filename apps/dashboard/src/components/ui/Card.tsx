interface CardProps {
  title: string;
  value: string | number;
  icon?: React.ComponentType<{ size: number }>;
  description?: string;
}

export function Card({ title, value, icon: Icon, description }: CardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start space-x-4">
      {Icon && (
        <div className="p-3 bg-light-blue rounded-lg text-dark-blue">
          <Icon size={24} />
        </div>
      )}
      <div>
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
      </div>
    </div>
  );
}
