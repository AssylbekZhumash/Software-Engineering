import { Monitor, MonitorPlay, Presentation, Speaker } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Equipment } from '@/data/rooms';

const ICONS: Record<Equipment, LucideIcon> = {
  projector: MonitorPlay,
  whiteboard: Presentation,
  computers: Monitor,
  speakers: Speaker,
};

export default function EquipmentIcon({ id, className }: { id: Equipment; className?: string }) {
  const Icon = ICONS[id];
  return <Icon className={className} aria-hidden="true" />;
}
