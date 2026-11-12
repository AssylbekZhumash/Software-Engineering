import { useMemo, useState } from 'react';
import { Building2 } from 'lucide-react';
import { ROOMS } from '@/data/rooms';
import { findRoomResults, type SearchQuery } from '@/lib/availability';
import SearchForm from '@/components/SearchForm';
import RoomResults from '@/components/RoomResults';

export default function App() {
  const [query, setQuery] = useState<SearchQuery | null>(null);
  const results = useMemo(() => (query ? findRoomResults(ROOMS, query) : null), [query]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white shadow-sm">
            <Building2 className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Smart Campus</p>
            <h1 className="text-lg font-semibold leading-tight text-slate-900 sm:text-xl">
              Room Availability Checker
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-8">
          <section
            aria-labelledby="search-heading"
            className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6"
          >
            <h2 id="search-heading" className="text-base font-semibold text-slate-900">
              Find a room
            </h2>
            <p className="mb-6 mt-1 text-sm text-slate-500">Check this campus room by group size, equipment, and time.</p>
            <SearchForm onCheck={setQuery} />
          </section>

          <section aria-label="Room results" className="min-w-0">
            <RoomResults query={query} results={results} />
          </section>
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          Prototype with fictional rooms. Checks are read-only and no bookings are created.
        </p>
      </main>
    </div>
  );
}
