type Day = { date: string; coverage: number | null };
export function CoverageChart({ days }: { days: Day[] }) {
  const point = (index: number, value: number) => ({ x: 12 + index / Math.max(days.length - 1, 1) * 276, y: 120 - value });
  const present = days.some(d => d.coverage !== null);
  return <section className="coverage-chart" aria-label="기간별 커버리지 추이">
    <h2>커버리지 추이 <small>데모 · %</small></h2>
    {present ? <svg viewBox="0 0 300 140" role="img" aria-label="날짜별 평균 커버리지. 미수신 날짜에는 점과 연결선이 없습니다. 상세 값은 아래 표에 있습니다.">
      <line x1="10" x2="290" y1="20" y2="20" className="chart-guide" /><line x1="10" x2="290" y1="120" y2="120" className="chart-guide" />
      {days.map((day, i) => { if (day.coverage === null) return null; const p = point(i, day.coverage); const prev = days[i - 1];
        return <g key={day.date}>{prev && prev.coverage !== null && <line x1={point(i - 1, prev.coverage).x} y1={point(i - 1, prev.coverage).y} x2={p.x} y2={p.y} className="chart-line" />}<circle cx={p.x} cy={p.y} r="4" className="chart-dot"><title>{day.date}: {day.coverage}%</title></circle></g>; })}
    </svg> : <p className="form-hint">수신된 커버리지 값이 없어 추이를 표시하지 않았어요.</p>}
    <div className="chart-dates"><span>{days[0]?.date}</span><span>{days.at(-1)?.date}</span></div>
    <details className="daily-table"><summary>날짜별 값 확인</summary><table><caption>데모 일별 평균 커버리지</caption><thead><tr><th scope="col">날짜</th><th scope="col">커버리지</th></tr></thead><tbody>{days.map(d => <tr key={d.date}><th scope="row">{d.date}</th><td>{d.coverage === null ? '미수신' : `${d.coverage}%`}</td></tr>)}</tbody></table></details>
  </section>;
}
