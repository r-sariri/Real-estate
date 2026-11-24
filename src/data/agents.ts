import type { Agent } from './types';

export const agents: Agent[] = [
  {
    id: 'daniel-morgan',
    name: 'دانیل مورگان',
    role: 'مدیرعامل',
    photoId: '1500648767791-00dcc994a43e',
    phone: '(555) 246-7890',
    email: 'daniel@horizonproperties.com',
    focus: 'عمارت‌های شاخص و معاملات خصوصی خارج از بازار.',
  },
  {
    id: 'olivia-carter',
    name: 'اولیویا کارتر',
    role: 'مشاور املاک لوکس',
    photoId: '1494790108377-be9c29b29330',
    phone: '(555) 246-7891',
    email: 'olivia@horizonproperties.com',
    focus: 'اقامتگاه‌های ساحلی و ساخت‌وسازهای معماری نو.',
  },
  {
    id: 'james-wilson',
    name: 'جیمز ویلسون',
    role: 'مشاور سرمایه‌گذاری',
    photoId: '1507003211169-0a1dd7228f2d',
    phone: '(555) 246-7892',
    email: 'james@horizonproperties.com',
    focus: 'راهبرد پرتفوی، تحلیل بازده و معاوضه‌های مالیاتی ۱۰۳۱.',
  },
  {
    id: 'sophia-bennett',
    name: 'سوفیا بنت',
    role: 'متخصص ارشد املاک',
    photoId: '1438761681033-6461ffad8d80',
    phone: '(555) 246-7893',
    email: 'sophia@horizonproperties.com',
    focus: 'جابه‌جایی، آماده‌سازی ملک و خریداران نخستین خانه لوکس.',
  },
];

export function getAgent(id: string): Agent {
  return agents.find((agent) => agent.id === id) ?? agents[0];
}
