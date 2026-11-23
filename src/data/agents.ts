import type { Agent } from './types';

export const agents: Agent[] = [
  {
    id: 'daniel-morgan',
    name: 'Daniel Morgan',
    role: 'Managing Director',
    photoId: '1500648767791-00dcc994a43e',
    phone: '(555) 246-7890',
    email: 'daniel@horizonproperties.com',
    focus: 'Landmark estates and private off-market acquisitions.',
  },
  {
    id: 'olivia-carter',
    name: 'Olivia Carter',
    role: 'Luxury Property Advisor',
    photoId: '1494790108377-be9c29b29330',
    phone: '(555) 246-7891',
    email: 'olivia@horizonproperties.com',
    focus: 'Coastal residences and architectural new builds.',
  },
  {
    id: 'james-wilson',
    name: 'James Wilson',
    role: 'Investment Consultant',
    photoId: '1507003211169-0a1dd7228f2d',
    phone: '(555) 246-7892',
    email: 'james@horizonproperties.com',
    focus: 'Portfolio strategy, yield analysis and 1031 exchanges.',
  },
  {
    id: 'sophia-bennett',
    name: 'Sophia Bennett',
    role: 'Senior Property Specialist',
    photoId: '1438761681033-6461ffad8d80',
    phone: '(555) 246-7893',
    email: 'sophia@horizonproperties.com',
    focus: 'Relocation, staging and first-time luxury buyers.',
  },
];

export function getAgent(id: string): Agent {
  return agents.find((agent) => agent.id === id) ?? agents[0];
}
