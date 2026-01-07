'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';

interface EventSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function EventSearch({
  value,
  onChange,
  placeholder = 'Search events...',
  className,
}: EventSearchProps) {
  const [inputValue, setInputValue] = useState(value);
  const debouncedValue = useDebounce(inputValue, 300);
  const onChangeRef = useRef(onChange);
  const isInternalChange = useRef(false);

  // Keep onChange ref up to date
  onChangeRef.current = onChange;

  // Only call onChange when debounced value changes from internal input
  useEffect(() => {
    if (isInternalChange.current) {
      onChangeRef.current(debouncedValue);
    }
  }, [debouncedValue]);

  // Sync external value changes (but not our own)
  useEffect(() => {
    if (!isInternalChange.current) {
      setInputValue(value);
    }
    isInternalChange.current = false;
  }, [value]);

  const handleInputChange = (newValue: string) => {
    isInternalChange.current = true;
    setInputValue(newValue);
  };

  const handleClear = () => {
    isInternalChange.current = true;
    setInputValue('');
    onChange('');
  };

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9"
      />
      {inputValue && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
}
