import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { WikipediaInfo } from '@/lib/type';
import Image from 'next/image';
import React from 'react';

export default function PioneerCard({
  personDetails,
  index,
}: {
  personDetails: WikipediaInfo;
  index: number;
}) {
  return (
    <Card key={index} className='flex flex-col'>
      <div className='mt-4 flex aspect-video h-[250px] items-center justify-center'>
        <Image
          src={personDetails.image_url}
          height={100}
          width={250}
          alt={personDetails.name}
          className='aspect-square object-cover'
        />
      </div>
      <CardHeader>
        <CardTitle>{personDetails.name}</CardTitle>
        <CardDescription>
          {personDetails.description.length >= 250 ? (
            <>
              <p>
                {personDetails.description}
                {'... '}
                <span
                  className='text-blue-500 underline hover:no-underline'
                  onClick={() =>
                    window.open(personDetails.wikipedia_link, '_blank')
                  }
                >
                  Read More
                </span>
              </p>
            </>
          ) : (
            personDetails.description
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className='flex-grow'>
        {personDetails.fieldOfWork.length > 0 && (
          <div className='mb-4'>
            <h3 className='mb-2 text-sm font-semibold'>Field of Work</h3>
            <div className='flex flex-wrap gap-2'>
              {personDetails.fieldOfWork.map((field, idx) => (
                <Badge
                  key={idx}
                  variant={'outline'}
                  className='border-none bg-teal-100 px-2 py-1 text-xs capitalize text-teal-800'
                >
                  {field}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {personDetails.notableWorks.length > 0 && (
          <div>
            <h3 className='mb-2 text-sm font-semibold'>Notable Works</h3>
            <div className='flex flex-wrap gap-2'>
              {personDetails.notableWorks.map((work, idx) => (
                <Badge
                  key={idx}
                  variant={'outline'}
                  className='border-none bg-blue-100 px-2 py-1 text-xs capitalize text-blue-800'
                >
                  {work}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
