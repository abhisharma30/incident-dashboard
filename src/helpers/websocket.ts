
import { Incident } from '../types/types';
import { createRandomIncident, updateRandomIncident } from '../mocks/mockData';

export function subscribeToIncidents(
  onUpdate: (incident: Incident) => void,
  onError: (msg: string) => void
): () => void {
  // Simulate a websocket by emitting events periodically
  let cancelled = false;
  const intervalId = window.setInterval(() => {
    if (cancelled) return;
    try {
      const shouldCreate = Math.random() < 0.4;
      const update = shouldCreate ? createRandomIncident() : updateRandomIncident();
      if (update) onUpdate(update);
    } catch {
      onError('Realtime stream error');
    }
  }, 4000);

  return () => {
    cancelled = true;
    window.clearInterval(intervalId);
  };
}
