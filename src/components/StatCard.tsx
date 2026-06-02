import Icon from "./Icon";

type Color = "primary" | "secondary" | "tertiary";

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  icon: string;
  color?: Color;
  progress?: string;
}

const colorMap: Record<Color, { bg: string; icon: string; bar: string }> = {
  primary:   { bg: "bg-primary-container/20",   icon: "text-primary",   bar: "bg-primary" },
  secondary: { bg: "bg-secondary-container/20", icon: "text-secondary", bar: "bg-secondary" },
  tertiary:  { bg: "bg-tertiary-container/20",  icon: "text-tertiary",  bar: "bg-tertiary" },
};

export default function StatCard({ label, value, delta, icon, color = "primary", progress }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className="bg-surface-container-lowest p-6 rounded-DEFAULT relative overflow-hidden group">
      <div className={`absolute -right-4 -top-4 w-24 h-24 ${c.bg} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">{label}</span>
          <Icon name={icon} size={22} className={c.icon} />
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-black text-on-surface font-headline">{value}</p>
          {delta && <span className="text-xs font-bold text-tertiary">{delta}</span>}
        </div>
        {progress && (
          <div className="mt-4 w-full h-1 bg-surface-container rounded-full overflow-hidden">
            <div className={`h-full ${c.bar}`} style={{ width: progress }} />
          </div>
        )}
      </div>
    </div>
  );
}
