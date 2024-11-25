'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { useFilter } from './Context/FilterContext';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function AppSidebar() {
  const {
    selectedField,
    setSelectedField,
    selectedWork,
    setSelectedWork,
    allFields,
    allNotableWorks,
    setInput,
  } = useFilter();

  const [fowOpen, setFowOpen] = useState(false);
  const [nwOpen, setNwOpen] = useState(false);

  return (
    <Sidebar className='top-[64px]'>
      <SidebarHeader>Search & Filter</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className='font-semibold'>
            Search
          </SidebarGroupLabel>
          <SidebarGroupContent className='flex justify-center'>
            <Input
              placeholder='e.g. alan turing'
              className='w-[200px] bg-white'
              onChange={(e) => setInput(e.target.value)}
            />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          {/* Filter Dropdown */}
          <SidebarGroupLabel className='font-semibold'>
            Filter by Field of Work:
          </SidebarGroupLabel>
          <SidebarGroupContent className='text-center'>
            <Popover open={fowOpen} onOpenChange={setFowOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={fowOpen}
                  className='w-[200px] justify-between'
                >
                  {selectedField ? (
                    <span className='capitalize'>
                      {allFields.find((field) => field === selectedField)}{' '}
                    </span>
                  ) : (
                    'Select field of work...'
                  )}
                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-[200px] p-0'>
                <Command>
                  <CommandInput placeholder='Search field of work...' />
                  <CommandList>
                    <CommandEmpty>No field of work found.</CommandEmpty>
                    <CommandGroup>
                      {allFields.map((field) => (
                        <CommandItem
                          key={field}
                          value={field}
                          onSelect={(currentValue) => {
                            setSelectedField(
                              currentValue === selectedField
                                ? ''
                                : currentValue,
                            );
                            setFowOpen(false);
                          }}
                          className='whitespace-nowrap capitalize'
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              selectedField === field
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                          {field}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </SidebarGroupContent>
          <SidebarGroupLabel className='font-semibold'>
            Filter by Notable Work:
          </SidebarGroupLabel>
          <SidebarGroupContent className='text-center'>
            <Popover open={nwOpen} onOpenChange={setNwOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={nwOpen}
                  className='w-[200px] justify-between'
                >
                  {selectedWork ? (
                    <span className='truncate capitalize'>
                      {allNotableWorks.find((work) => work === selectedWork)}{' '}
                    </span>
                  ) : (
                    'Select field of work...'
                  )}
                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-[200px] p-0'>
                <Command>
                  <CommandInput placeholder='Search field of work...' />
                  <CommandList>
                    <CommandEmpty>No notable work found.</CommandEmpty>
                    <CommandGroup>
                      {allNotableWorks.map((work) => (
                        <CommandItem
                          key={work}
                          value={work}
                          onSelect={(currentValue) => {
                            setSelectedWork(
                              currentValue === selectedWork ? '' : currentValue,
                            );
                            setNwOpen(false);
                          }}
                          className='truncate whitespace-nowrap capitalize'
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              selectedWork === work
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                          {work}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          {(selectedField || selectedWork) && (
            <Button
              variant={'destructive'}
              onClick={() => {
                setSelectedField(null);
                setSelectedWork(null);
              }}
            >
              Clear Filter
            </Button>
          )}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
