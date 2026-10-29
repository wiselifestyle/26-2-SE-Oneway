import { CircleDashed, Info, TriangleAlert } from 'lucide-react';

type Props = { title: string; description: string; kind?: 'preparing' | 'empty' | 'error' };

export function StateNotice({ title, description, kind = 'preparing' }: Props) {
  const Icon = kind === 'error' ? TriangleAlert : kind === 'empty' ? Info : CircleDashed;
  return (
    <section className="state-notice" aria-label={title}>
      <span className="state-icon"><Icon size={28} strokeWidth={1.6} aria-hidden="true" /></span>
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  );
}
