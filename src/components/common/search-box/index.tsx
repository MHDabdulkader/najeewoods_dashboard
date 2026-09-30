import { Input } from "@/components/ui";
import { Search } from "lucide-react";
import React from "react";

interface SearchBoxProps {
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBox({ 
  onChange,
  placeholder = "Search",
  className = ""
}: SearchBoxProps) {
  const handleChange = (value: string) => {
    onChange(value);
  };

  return (
    <div className={`relative w-full md:max-w-xs xl:max-w-xl 2xl:max-w-2xl blur-bg rounded-full py-1 ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-grays" />
      <Input
        type="text"
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-4 py-2 rounded-full border-none w-full placeholder:text-grays"
      />
    </div>
  );
}
