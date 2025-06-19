
import React, { useState, useEffect } from 'react';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Soldier } from '@/types';
import { useAppStore } from '@/store/useAppStore';

interface SoldierSearchProps {
  onSelectSoldier: (soldier: Soldier | null) => void;
  selectedSoldier?: Soldier | null;
  placeholder?: string;
  disabled?: boolean;
}

const SoldierSearch: React.FC<SoldierSearchProps> = ({
  onSelectSoldier,
  selectedSoldier,
  placeholder = "חפש חייל לפי שם או מספר אישי...",
  disabled = false
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { soldiers, searchSoldiers } = useAppStore();
  const [filteredSoldiers, setFilteredSoldiers] = useState<Soldier[]>([]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchSoldiers(searchQuery);
      setFilteredSoldiers(results);
    } else {
      setFilteredSoldiers(soldiers.slice(0, 10)); // Show first 10 soldiers when no search
    }
  }, [searchQuery, soldiers, searchSoldiers]);

  const handleSelect = (soldier: Soldier) => {
    onSelectSoldier(soldier);
    setOpen(false);
    setSearchQuery('');
  };

  const handleClear = () => {
    onSelectSoldier(null);
  };

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {selectedSoldier ? (
              <div className="flex items-center">
                <span className="font-medium">{selectedSoldier.fullName}</span>
                <span className="text-gray-500 mr-2">({selectedSoldier.militaryId})</span>
              </div>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="הקלד לחיפוש..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>לא נמצאו חיילים</CommandEmpty>
              <CommandGroup>
                {filteredSoldiers.map((soldier) => (
                  <CommandItem
                    key={soldier.id}
                    value={`${soldier.fullName} ${soldier.militaryId}`}
                    onSelect={() => handleSelect(soldier)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{soldier.fullName}</span>
                      <span className="text-sm text-gray-500">
                        מ.א: {soldier.militaryId} | {soldier.rank} | {soldier.mador}
                      </span>
                    </div>
                    <Check
                      className={cn(
                        "ml-2 h-4 w-4",
                        selectedSoldier?.id === soldier.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {selectedSoldier && (
        <div className="mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-red-600 hover:text-red-700"
          >
            נקה בחירה
          </Button>
        </div>
      )}
    </div>
  );
};

export default SoldierSearch;
