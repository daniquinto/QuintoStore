import { Outlet } from 'react-router-dom';
import Header from '../organisms/Header/Header';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
    </div>
  );
}
