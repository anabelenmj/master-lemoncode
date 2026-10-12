import { Outlet, useNavigate } from "react-router";
import { ROUTES } from "#core/router";
import { useAuthContext } from "#core/auth";

export const AppLayout = () => {
  const { userSession, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen">
      <header className="navbar bg-base-200 px-6">
        <div className="flex-1 text-lg font-bold">Rick &amp; Morty</div>
        <div className="flex items-center gap-4">
          <span className="text-sm opacity-70">{userSession?.name}</span>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-6">
        <Outlet />
      </main>
    </div>
  );
};