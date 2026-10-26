import { Link } from 'react-router-dom';
import { useNav } from '../nav/NavContext';
import { firstAllowedRoute } from '../nav/navModel';

export function NotFoundPage() {
  const { config, filter } = useNav();
  const home = firstAllowedRoute(config, filter);
  return (
    <div className="page">
      <h1>صفحه پیدا نشد</h1>
      <p className="sub">آدرس واردشده در سامانه وجود ندارد.</p>
      {home && <Link className="btn" to={home}>رفتن به صفحه اصلی</Link>}
    </div>
  );
}
