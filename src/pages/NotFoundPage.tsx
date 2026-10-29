import { Link } from 'react-router';
import { StateNotice } from '../components/StateNotice';

export function NotFoundPage() {
  return <div className="content-page">
    <div className="page-eyebrow">페이지 안내</div>
    <h1>페이지를 찾을 수 없어요</h1>
    <StateNotice kind="error" title="주소를 다시 확인해주세요" description="존재하지 않거나 변경된 경로입니다. 홈에서 원하는 화면을 찾아보세요." />
    <Link className="primary-link" to="/">홈으로 이동</Link>
  </div>;
}
