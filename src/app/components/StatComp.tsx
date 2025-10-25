export const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="text-center">
    <div className="text-sm">{label}</div>
    <div className="text-2xl font-mono text-accent">{value}</div>
  </div>
);