'use client';

import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  memo,
  useRef,
} from 'react';
// import Masonry from 'react-masonry-css';
import { WikipediaInfo } from '@/lib/type';
import PioneerCard from '../Cards/Pioneers';
import { useSidebar } from '../ui/sidebar';
import { useFilter } from '../Context/FilterContext';
import { Badge } from '../ui/badge';
import { CircleX } from 'lucide-react';
import { loadPioneers } from '@/app/actions';
import { cn } from '@/lib/utils';

interface HomePageProps {
  pioneers: WikipediaInfo[];
}

// Memoized PioneerCard component
const MemoizedPioneerCard = memo(
  ({
    personDetails,
    index,
    lastItemRef,
  }: {
    personDetails: WikipediaInfo;
    index: number;
    lastItemRef: ((node: HTMLDivElement) => void) | null;
  }) => (
    <PioneerCard
      personDetails={personDetails}
      index={index}
      lastItemRef={lastItemRef}
    />
  ),
);

MemoizedPioneerCard.displayName = 'MemoizedPioneerCard';

const FilterBadge = memo(
  ({
    value,
    onClear,
    colorClass,
  }: {
    label: string;
    value: string;
    onClear: () => void;
    colorClass: string;
  }) => (
    <Badge
      variant='outline'
      className={`space-x-1 border-none px-2 py-1 text-xs capitalize ${colorClass}`}
    >
      <span>{value}</span>
      <CircleX size={18} className='hover:stroke-black' onClick={onClear} />
    </Badge>
  ),
);
FilterBadge.displayName = 'FilterBadge';

export default function HomePage({ pioneers: initialPioneers }: HomePageProps) {
  const { state } = useSidebar();
  const {
    setPioneers: setGlobalPioneers,
    selectedField,
    selectedWork,
    setSelectedField,
    setSelectedWork,
    input,
  } = useFilter();

  const [isFetching, setIsFetching] = useState(false);
  const [pioneers, setPioneers] = useState(initialPioneers);

  // Memoize the breakpoint configuration
  // const breakpointColumnsObj = useMemo(
  //   () => ({
  //     // default: state === 'expanded' ? 2 : 4,
  //     2560: state === 'expanded' ? 2 : 4,
  //     1440: state === 'expanded' ? 2 : 4,
  //     1024: state === 'expanded' ? 1 : 2,
  //     768: state === 'expanded' ? 1 : 2,
  //     640: 1,
  //     425: 1,
  //   }),
  //   [state],
  // );

  useEffect(() => {
    setGlobalPioneers(pioneers);
  }, [pioneers, setGlobalPioneers]);

  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastItemRef = useCallback(
    (node: HTMLDivElement) => {
      if (isFetching) return;
      if (pioneers.length === 50) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting) {
          if (isFetching) return;

          setIsFetching(true);
          try {
            const newData = await loadPioneers({
              lastId: pioneers[pioneers.length - 1].id,
              page: pioneers.length / 10 + 1,
            });
            if (newData.length >= 1) {
              setPioneers((prevPioneers) => [...prevPioneers, ...newData]);
            }
          } catch (error) {
            console.error('Error loading more pioneers:', error);
          } finally {
            setIsFetching(false);
          }
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [isFetching, pioneers],
  );

  const filteredPioneers = useMemo(() => {
    return pioneers.filter((person) => {
      const matchesField =
        !selectedField || person.fieldOfWork.includes(selectedField);
      const matchesWork =
        !selectedWork || person.notableWorks.includes(selectedWork);
      const matchedWord =
        !input ||
        person.name.toLowerCase().trim().includes(input.toLowerCase().trim()) ||
        person.description
          .toLowerCase()
          .trim()
          .includes(input.toLowerCase().trim());
      return matchesField && matchesWork && matchedWord;
    });
  }, [pioneers, selectedField, selectedWork, input]);

  const clearField = useCallback(
    () => setSelectedField(null),
    [setSelectedField],
  );
  const clearWork = useCallback(() => setSelectedWork(null), [setSelectedWork]);

  return (
    <div className='space-y-2 px-6 py-4'>
      {(selectedField || selectedWork) && (
        <div className='capitalize'>
          Filters:{' '}
          {selectedField && (
            <FilterBadge
              label='Field'
              value={selectedField}
              onClear={clearField}
              colorClass='bg-teal-100 text-teal-800'
            />
          )}{' '}
          {selectedWork && (
            <FilterBadge
              label='Work'
              value={selectedWork}
              onClear={clearWork}
              colorClass='bg-blue-100 text-blue-800'
            />
          )}
        </div>
      )}

      {filteredPioneers.length === 0 ? (
        <div>No pioneer found!</div>
      ) : (
        <>
          <div
            // breakpointCols={breakpointColumnsObj}
            className={cn(
              'grid grid-cols-1 gap-6',
              state === 'expanded'
                ? 'sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2'
                : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
            )}
            // columnClassName='my-masonry-grid_column'
          >
            {filteredPioneers.map((person, index) => {
              const isLastItem = index === filteredPioneers.length - 1;
              return (
                <MemoizedPioneerCard
                  key={person.id}
                  personDetails={person}
                  index={index}
                  lastItemRef={isLastItem ? lastItemRef : null}
                />
              );
            })}
          </div>
          <div className='flex w-full justify-center'>
            {/* <Button
              variant={'outline'}
              onClick={loadMoreP}
              disabled={isFetching}
              className='mt-4'
            > */}
            {isFetching && (
              <>
                <p>Loading...</p>
              </>
            )}
            {/* </Button> */}
          </div>
        </>
      )}
    </div>
  );
}
