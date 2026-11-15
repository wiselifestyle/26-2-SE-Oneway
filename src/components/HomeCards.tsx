import { CalendarPlus, ChevronRight, CircleCheck, Clock, Flame, Link2, TriangleAlert } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router';
import { dateTimeLabel } from '../domain/brushing';
import { homeCards } from '../domain/home';
import type { HomeCard } from '../domain/home';
import { useBrushing } from '../state/brushingStore';

type View = { to: string; tone: 'alert' | 'warn' | 'good' | 'info'; icon: LucideIcon; title: string; description: string };
function view(card: HomeCard): View {
  switch (card.kind) {
    case 'device-error': return { to: '/device', tone: 'alert', icon: TriangleAlert, title: '기기 연결에 실패했어요', description: '원인별 해결 방법을 확인하고 다시 연결하세요.' };
    case 'tip-replace': return { to: '/recommendations', tone: 'alert', icon: Clock, title: '팁 교체 시기가 지났어요', description: `사용 ${card.usedDays}일 · 권장 주기는 데모 가정` };
    case 'tip-soon': return { to: '/recommendations', tone: 'warn', icon: Clock, title: `팁 교체까지 ${card.remainingDays}일`, description: `사용 ${card.usedDays}일 · 미리 교체용 팁을 준비하세요` };
    case 'streak': return { to: '/brushing', tone: 'good', icon: Flame, title: card.current ? `${card.current}일째 연속 양치 중` : '연속 기록을 다시 시작해요', description: `최고 ${card.best}일 · ${card.brushedToday ? '오늘 기록 완료' : '오늘 아직 기록 없음'}` };
    case 'device-connected': return { to: '/brushing', tone: 'info', icon: CircleCheck, title: '기기 모의 연결됨', description: `예시 기록 ${card.records}건 · 마지막 동기화 ${dateTimeLabel(card.lastSync)}` };
    case 'device-disconnected': return { to: '/device', tone: 'info', icon: Link2, title: '기기를 연결해 기록을 받아보세요', description: '시연용 모의 연결 · 실제 Bluetooth 아님' };
    case 'tip-unset': return { to: '/recommendations', tone: 'info', icon: CalendarPlus, title: '팁 교체일을 기록해보세요', description: '교체 시기가 다가오면 여기서 알려드려요' };
  }
}

// RE-C1: "today" cards ordered by domain rules (see domain/home.ts).
export function HomeCards() {
  const state = useBrushing();
  const cards = homeCards(state, Date.now());
  return <section className="home-section" aria-labelledby="today-title">
    <div className="section-heading"><div><p className="eyebrow">Today</p><h2 id="today-title">오늘의 관리</h2></div><span className="section-caption">데모 데이터 기준</span></div>
    <div className="today-cards">{cards.map(card => { const { to, tone, icon: Icon, title, description } = view(card); return <Link key={card.kind} to={to} className={`today-card ${tone}`}>
      <span className="today-icon"><Icon size={21} strokeWidth={1.8} aria-hidden="true" /></span>
      <span className="min-w-0 flex-1"><strong>{title}</strong><small>{description}</small></span>
      <ChevronRight size={18} className="shrink-0" aria-hidden="true" />
    </Link>; })}</div>
  </section>;
}
