import { ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router';

type Props = { to: string; title: string; description: string; icon: LucideIcon };

export function NavigationCard({ to, title, description, icon: Icon }: Props) {
  return (
    <Link to={to} className="navigation-card">
      <span className="navigation-icon"><Icon size={23} strokeWidth={1.7} aria-hidden="true" /></span>
      <span className="min-w-0 flex-1"><strong>{title}</strong><small>{description}</small></span>
      <ChevronRight size={18} className="shrink-0" aria-hidden="true" />
    </Link>
  );
}
