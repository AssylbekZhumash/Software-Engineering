import { AlertCircle, Ban, CheckCircle2, MapPin, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { EQUIPMENT_OPTIONS } from '@/data/rooms';
import type { RoomResult, RoomStatus } from '@/lib/availability';
import EquipmentIcon from '@/components/EquipmentIcon';

const STATUS_STYLES: Record<RoomStatus, { label: string; icon: LucideIcon; badge: string; accent: string }> = {
  available: {
    label: 'Available',
    icon: CheckCircle2,
    badge: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    accent: 'bg-emerald-500',
  },
  unavailable: {
    label: 'Unavailable',
    icon: AlertCircle,
    badge: 'bg-amber-50 text-amber-900 ring-amber-200',
    accent: 'bg-amber-500',
  },
  blocked: {
    label: 'Blocked',
    icon: Ban,
    badge: 'bg-rose-50 text-rose-800 ring-rose-200',
    accent: 'bg-rose-500',
  },
};

export default function RoomResultCard({ result }: { result: RoomResult }) {
  const { room, status, reason } = result;
  const style = STATUS_STYLES[status];
  const StatusIcon = style.icon;

  return (
    <article className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 pl-5 shadow-sm transition hover:shadow-md sm:p-5 sm:pl-6">
      <span className={`absolute inset-y-0 left-0 w-1 ${style.accent}`} aria-hidden="true" />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-slate-900">{room.name}</h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {room.building}
          </p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 self-start rounded-full px-3 py-1 text-xs font-semibold ring-1 ${style.badge}`}
        >
          <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {style.label}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
          Capacity <span className="font-semibold text-slate-800">{room.capacity}</span>
        </span>
        <ul className="flex flex-wrap gap-1.5" aria-label="Equipment">
          {room.equipment.map((item) => {
            const label = EQUIPMENT_OPTIONS.find((option) => option.id === item)?.label ?? item;
            return (
              <li
                key={item}
                className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700"
              >
                <EquipmentIcon id={item} className="h-3 w-3" />
                {label}
              </li>
            );
          })}
        </ul>
      </div>

      {reason && (
        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700">{reason}</p>
      )}
    </article>
  );
}
