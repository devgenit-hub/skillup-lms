interface PageHeaderProps {
  title: string;
  description?: string;
  actionButton?: React.ReactNode;
}
// src/components/ui/PageHeader.jsx
export function PageHeader({ title, description, actionButton }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        {description && <p className="text-slate-500 mt-1">{description}</p>}
      </div>
      {actionButton}
    </div>
  );
}
