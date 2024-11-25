import HomePage from '@/components/Home';
import { loadPioneers } from './actions';
import { headers } from 'next/headers';

// Mark page as dynamic
export const revalidate = 0;

// Add dynamic config
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function Page() {
  // Force dynamic behavior by reading headers
  headers();

  try {
    const validData = await loadPioneers({
      page: null,
      lastId: null,
    });

    return (
      <main className='container mx-auto mt-12 w-full'>
        <HomePage pioneers={validData} />
      </main>
    );
  } catch (error) {
    console.error('Page error:', error);
    return (
      <main className='container mx-auto mt-12 w-full'>
        <div className='text-center text-red-500'>
          Failed to load pioneers. Please try again later.
        </div>
      </main>
    );
  }
}
