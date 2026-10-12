import React from "react";
import { useNavigate } from "react-router";
import { useAuthContext } from "#core/auth";
import { ROUTES } from "#core/router";
import { LoginComponent } from "./login.component";
import type { Credentials } from "./login.schema";
import { login } from "./api";

export const LoginContainer = () => {
  const { setUserSession } = useAuthContext();
  const navigate = useNavigate();

  const [error, setError] = React.useState("");
  const [isPending, setIsPending] = React.useState(false);

  const handleLogin = async (credentials: Credentials) => {
    setError("");
    setIsPending(true);

    try {
      const userSession = await login(credentials)

      setUserSession(userSession);
      navigate(ROUTES.CHARACTERS);
    } catch {
      setError("No se ha podido conectar con el servidor");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <LoginComponent error={error} isPending={isPending} onLogin={handleLogin} />
  );
};