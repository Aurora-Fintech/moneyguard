import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import RestrictedRoute from "./RestrictedRoute";

import HomeTable from "../components/HomeTable/HomeTable";
import Statistics from "../components/Statistics/Statistics";
import { useDispatch } from "react-redux";
import React, { Suspense, useEffect } from "react";
import { refreshUser } from "../features/auth/authOperations";
import { Oval } from "react-loader-spinner";

const LoginPage = React.lazy(() => import("../pages/LoginPage/LoginPage"));
const RegistrationPage = React.lazy(() =>
  import("../pages/RegistrationPage/RegistrationPage")
);
const DashboardPage = React.lazy(() =>
  import("../pages/DashboardPage/DashboardPage")
);
const NotFoundPage = React.lazy(() =>
  import("../pages/NotFoundPage/NotFoundPage")
);

const Loader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
    }}
  >
    <Oval
      height={80}
      width={80}
      color="var(--font-color-purple)"
      visible={true}
      ariaLabel="oval-loading"
      secondaryColor="var(--font-color-white-60)"
      strokeWidth={3}
      strokeWidthSecondary={3}
    />
  </div>
);

export default function AppRouter() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route
            path="/login"
            element={
              <RestrictedRoute>
                <LoginPage />
              </RestrictedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <RestrictedRoute>
                <RegistrationPage />
              </RestrictedRoute>
            }
          />

          {/* Dashboard + nested içerik */}
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          >
            {/* /dashboard -> HomeTable */}
            <Route index element={<HomeTable />} />
            {/* /dashboard/statistics -> Statistics */}
            <Route path="statistics" element={<Statistics />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
