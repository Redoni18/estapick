import { Spinner } from '@/components/ui/Spinner';

export default function Loading() {
  return (
    <div className="min-h-screen bg-surface-0 flex flex-col items-center justify-center gap-3 text-muted">
      <Spinner className="w-10 h-10" />
      <p className="text-sm font-medium">Retrieving listing details...</p>
    </div>
  );
}
