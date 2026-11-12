import { useState, type FormEvent } from 'react';
import { Search, Users, Clock } from 'lucide-react';
import { EQUIPMENT_OPTIONS, type Equipment } from '@/data/rooms';
import { validateSearch, type SearchErrors, type SearchQuery } from '@/lib/availability';
import EquipmentIcon from '@/components/EquipmentIcon';

interface SearchFormProps {
  onCheck: (query: SearchQuery) => void;
}

const inputBase =
  'mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:ring-4';
const inputOk = 'border-slate-300 focus:border-blue-600 focus:ring-blue-100';
const inputError = 'border-rose-400 focus:border-rose-600 focus:ring-rose-100';

export default function SearchForm({ onCheck }: SearchFormProps) {
  const [attendees, setAttendees] = useState('');
  const [startHour, setStartHour] = useState('');
  const [endHour, setEndHour] = useState('');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [errors, setErrors] = useState<SearchErrors>({});

  const toggleEquipment = (id: Equipment) => {
    setEquipment((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { query, errors: nextErrors } = validateSearch({ attendees, startHour, endHour, equipment });
    setErrors(nextErrors);
    if (query) onCheck(query);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div>
        <label htmlFor="attendees" className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Users className="h-4 w-4 text-slate-500" aria-hidden="true" />
          Number of attendees
        </label>
        <input
          id="attendees"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="e.g. 10"
          value={attendees}
          onChange={(e) => setAttendees(e.target.value)}
          aria-invalid={Boolean(errors.attendees)}
          aria-describedby={errors.attendees ? 'attendees-error' : 'attendees-hint'}
          className={`${inputBase} ${errors.attendees ? inputError : inputOk}`}
        />
        {errors.attendees ? (
          <p id="attendees-error" className="mt-1.5 text-xs font-medium text-rose-700">
            {errors.attendees}
          </p>
        ) : (
          <p id="attendees-hint" className="mt-1.5 text-xs text-slate-500">
            Rooms smaller than this group are hidden.
          </p>
        )}
      </div>

      <fieldset>
        <legend className="text-sm font-semibold text-slate-800">Required equipment</legend>
        <p className="mt-1 text-xs text-slate-500">Select every item the room must have.</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {EQUIPMENT_OPTIONS.map((option) => {
            const selected = equipment.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleEquipment(option.id)}
                className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 ${
                  selected
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                    selected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <EquipmentIcon id={option.id} className="h-4 w-4" />
                </span>
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Clock className="h-4 w-4 text-slate-500" aria-hidden="true" />
          Time window (24-hour HH)
        </legend>
        <p className="mt-1 text-xs text-slate-500">Whole hours only, such as 09 to 11.</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="start-hour" className="text-xs font-medium text-slate-700">
              Start hour
            </label>
            <input
              id="start-hour"
              type="text"
              inputMode="numeric"
              maxLength={2}
              placeholder="HH"
              value={startHour}
              onChange={(e) => setStartHour(e.target.value)}
              aria-invalid={Boolean(errors.startHour)}
              aria-describedby={errors.startHour ? 'start-error' : undefined}
              className={`${inputBase} font-mono ${errors.startHour ? inputError : inputOk}`}
            />
          </div>
          <div>
            <label htmlFor="end-hour" className="text-xs font-medium text-slate-700">
              End hour
            </label>
            <input
              id="end-hour"
              type="text"
              inputMode="numeric"
              maxLength={2}
              placeholder="HH"
              value={endHour}
              onChange={(e) => setEndHour(e.target.value)}
              aria-invalid={Boolean(errors.endHour)}
              aria-describedby={errors.endHour ? 'end-error' : undefined}
              className={`${inputBase} font-mono ${errors.endHour ? inputError : inputOk}`}
            />
          </div>
        </div>
        {(errors.startHour || errors.endHour) && (
          <div className="mt-2 space-y-1">
            {errors.startHour && (
              <p id="start-error" className="text-xs font-medium text-rose-700">
                Start: {errors.startHour}
              </p>
            )}
            {errors.endHour && (
              <p id="end-error" className="text-xs font-medium text-rose-700">
                End: {errors.endHour}
              </p>
            )}
          </div>
        )}
      </fieldset>

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 active:translate-y-px"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        Check Availability
      </button>
    </form>
  );
}
