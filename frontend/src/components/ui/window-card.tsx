import { CalendarDays } from "lucide-react";

interface WindowCardProps {
  title: string;
  description: React.ReactNode;
  lastUpdated?: string;
}
const WindowCard = ({ title, description, lastUpdated }: WindowCardProps) => {
  return (
    <div className="flex justify-between space-x-4">
      <div className="space-y-1">
        <h4 className="text-sm font-semibold">{title}</h4>
        <p className="text-sm">{description}</p>
        {lastUpdated && (
          <div className="flex items-center pt-2">
            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-xs text-muted-foreground">
              Updated {lastUpdated}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WindowCard;
