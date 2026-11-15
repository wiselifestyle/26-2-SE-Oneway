import { Flame } from 'lucide-react';
import { brushingStreak, gradeLabels, sessionGrade } from '../domain/brushing';
import type { BrushingSession } from '../domain/brushing';

// RE-C3: interpret the score instead of showing a bare number.
export function GradeChip({ score }: { score: number | null }) {
  const grade = sessionGrade(score);
  return <span className={`grade-chip ${grade}`}>{gradeLabels[grade].label}</span>;
}

// RE-C2: streak with a no-blame recovery message.
export function StreakCard({ sessions }: { sessions: BrushingSession[] }) {
  const streak = brushingStreak(sessions, Date.now());
  if (!streak) return null;
  return <section className={`streak-card ${streak.current ? '' : 'broken'}`} aria-label="양치 연속 기록">
    <span className="streak-icon"><Flame size={24} aria-hidden="true" /></span>
    <div>
      <strong>{streak.current ? `${streak.current}일째 연속 양치 중` : '연속 기록이 끊겼어요'}</strong>
      <p>{!streak.current ? '괜찮아요. 오늘 한 번 닦으면 다시 1일부터 시작해요.' : streak.brushedToday ? '오늘도 기록했어요. 내일도 이어가 보세요.' : '오늘 기록하면 연속 기록이 이어져요.'}</p>
      <small>최고 {streak.best}일 · 예시 기록 기준</small>
    </div>
  </section>;
}
