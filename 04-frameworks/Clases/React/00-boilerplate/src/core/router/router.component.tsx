import { CharacterDetailScene, CharacterListScene, LoginScene } from "#scenes";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { PrivateRoutes } from "./private-routes.component";
import { AppLayout } from "#layout";
import { ROUTES } from "#core/router";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginScene />} />
        <Route element={<PrivateRoutes />}>
          <Route element={<AppLayout />} >
            <Route path={ROUTES.CHARACTERS} element={<CharacterListScene />} />
            <Route
              path={ROUTES.CHARACTER_DETAIL}
              element={<CharacterDetailScene />}
            />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </BrowserRouter>
  );
};
