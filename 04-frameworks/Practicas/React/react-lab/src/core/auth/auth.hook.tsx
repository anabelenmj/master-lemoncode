import React from "react";
import type { UserSession } from "./auth.vm";
import * as api from "./auth.api";

export const useAuthContext = () => {
  const [userSession, setUserSession] = React.useState<UserSession | null>(
    null,
  );
  const [isChecking, setIsChecking] = React.useState(true);

  React.useEffect(() => {
    api
      .getUserSession()
      .then(setUserSession)
      .catch(() => setUserSession(null))
      .finally(() => setIsChecking(false));
  }, []);

  const logout = async () => {
    await api.logout();
    setUserSession(null);
  };

  return { userSession, isChecking, setUserSession, logout };
};