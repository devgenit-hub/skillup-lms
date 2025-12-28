import React from 'react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group';
import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <InputGroup className="h-full bg-card backdrop-blur-xl rounded-3xl shadow-lg border border-border transition-all duration-300 hover:shadow-xl focus-within:shadow-xl focus-within:border-vibrant-blue/30">
      <InputGroupInput
        placeholder="Search courses, classes..."
        className="bg-transparent border-none focus:ring-0 text-sm lg:text-base placeholder:text-muted-foreground"
      />
      <InputGroupAddon align="inline-end">
        <div className="p-2 rounded-xl bg-linear-to-br from-vibrant-blue to-indigo-600 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105">
          <Search className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white" />
        </div>
      </InputGroupAddon>
    </InputGroup>
  );
}
