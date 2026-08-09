import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchFilterProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  onClick?: () => void;
  readOnly?: boolean;
}

export function SearchFilter({
  value,
  onChange,
  placeholder = "Cari data...",
  className = "",
  onClick,
  readOnly,
}: SearchFilterProps) {
  return (
    <div className={`relative w-full lg:w-80 ${className}`}>
      <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        onClick={onClick}
        readOnly={readOnly}
        className="pl-9 h-8 bg-muted/50 border border-border/60 rounded-lg text-[13px] shadow-none focus:bg-background transition-colors"
      />
    </div>
  );
}
