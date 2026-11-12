import { CalendarX2, SearchX, Sparkles } from 'lucide-react';
import { CURRENT_TIME, formatHour, type RoomResult, type SearchQuery } from '@/lib/availability';
import RoomResultCard from '@/components/RoomResultCard';

interface RoomResultsProps {
  query: SearchQuery | null;
  results: RoomResult[] | null;
}

function describeWindow(query: SearchQuery): string {
  return `${formatHour(query.startHour * 60)} to ${formatHour(query.endHour * 60)}`;
}

export default function RoomResults({ query, results }: RoomResultsProps) {
  if (!query || !results) {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-12 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-700">
          <Sparkles className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-base font-semibold text-slate-900">Ready when you are</h2>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          Enter the group size, pick any equipment you need, choose a time window, then select Check Availability.
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div
        role="status"
        className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600">
          <SearchX className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-base font-semibold text-slate-900">No matching rooms</h2>
        <p className="mt-1 max-w-sm text-sm text-slate-600">
          No room fits {query.attendees} {query.attendees === 1 ? 'attendee' : 'attendees'}
          {query.equipment.length > 0 ? ' with the selected equipment' : ''}. Try fewer attendees or fewer equipment filters.
        </p>
      </div>
    );
  }

  const availableCount = results.filter((r) => r.status === 'available').length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Results for {describeWindow(query)}</p>
          <p className="mt-1 flex items-center gap-2 text-base font-semibold text-slate-900">
            <CalendarX2 className="h-4 w-4 text-slate-400" aria-hidden="true" />
            {availableCount === 0
              ? 'No rooms are free in this window'
              : `${availableCount} of ${results.length} matching ${results.length === 1 ? 'room is' : 'rooms are'} available`}
          </p>
        </div>
        <p className="text-xs text-slate-500">Current time is assumed to be {formatHour(CURRENT_TIME)}.</p>
      </div>

      <div role="list" aria-live="polite" className="space-y-3">
        {results.map((result) => (
          <div role="listitem" key={result.room.id}>
            <RoomResultCard result={result} />
          </div>
        ))}
      </div>
    </div>
  );
}
