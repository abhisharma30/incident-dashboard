export interface Incident {
    id: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    service: string;
    status: 'open' | 'resolved';
    owner: string;
    timestamp: string;
  }
  