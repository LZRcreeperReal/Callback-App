export type ServiceId = 'resume-review' | 'mock-interview' | 'complete-bundle';

export interface Service {
  id: ServiceId;
  name: string;
  price: number; // in cents (USD)
  turnaround: string;
  description: string;
  features: string[];
}

export const SERVICES: Record<ServiceId, Service> = {
  'resume-review': {
    id: 'resume-review',
    name: 'Resume Review',
    price: 4900,
    turnaround: '48-hour turnaround',
    description:
      "Line-by-line feedback from someone who's actually hired for your target role.",
    features: [
      'Written, line-by-line feedback',
      'ATS pass/fail check',
      'Rewritten bullet-point examples',
      '48-hour turnaround',
    ],
  },
  'mock-interview': {
    id: 'mock-interview',
    name: 'Mock Interview Critique',
    price: 8900,
    turnaround: '48-hour turnaround',
    description:
      'Submit your answers, get a recorded expert critique on content, delivery, and structure.',
    features: [
      'Recorded video critique',
      'Structure & delivery feedback',
      'Role-specific question bank',
      '48-hour turnaround',
    ],
  },
  'complete-bundle': {
    id: 'complete-bundle',
    name: 'Complete Prep Bundle',
    price: 11900,
    turnaround: '48-hour turnaround',
    description:
      'Resume review and mock interview critique together, at a lower combined price.',
    features: [
      'Everything in Resume Review',
      'Everything in Mock Interview Critique',
      'Priority matching',
      '48-hour turnaround',
    ],
  },
};
