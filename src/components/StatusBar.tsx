interface StatusBarProps {
  icon: string;
  label: string;
  value: number;
  colorClassName: string;
}

export function StatusBar({ icon, label, value, colorClassName }: StatusBarProps) {
  return (
    <div className="flex items-center gap-2">
      <img src={icon} alt="" className="pixel-img h-4 w-4 shrink-0" />
      <div className="flex-1">
        <div className="flex justify-between text-[10px] font-pixel text-brown">
          <span>{label}</span>
          <span>{value}</span>
        </div>
        <div className="mt-1 h-3 w-full border-2 border-brown bg-cream-light">
          <div
            className={`h-full ${colorClassName}`}
            style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
