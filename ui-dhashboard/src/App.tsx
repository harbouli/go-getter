import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { currentUser, verifyToken } from "utils/api";

import AdminLayout from "./layouts/admin";
import SignInCentered from "views/auth/signIn";
import withAuth from "components/HOC/";
import axios from "axios";
import useToken from "hooks/useToken";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store";
import { setUser } from "store/moderatores/moderatoreSlice";

type AuthState = {
  authenticated: boolean;
  loading: boolean;
};
const App = () => {
  const [authState, setAuthState] = useState<AuthState>({
    authenticated: false,
    loading: false,
  });
  const { getToken, removeToken } = useToken();
  const dispatch = useDispatch<AppDispatch>();

  const Token = getToken();
  const storedToken = getToken();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log(storedToken);
        if (storedToken) {
          const res = await verifyToken(storedToken);
          const authHeader = res.headers.authorization;

          if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.slice(7);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            setAuthState({ authenticated: res.data.valid, loading: false });
            const user = await currentUser(token);
            dispatch(setUser(user.data));
          }
        } else {
          setAuthState({ authenticated: false, loading: false });
        }
      } catch (error) {
        console.log(error);
        removeToken();
      }
    };
    checkAuth();
  }, [Token]);

  if (authState.loading) {
    return <p>Loading...</p>;
  }
  return (
    <Switch>
      <Route path={`/auth`} component={SignInCentered} />

      <Route path={`/admin`} component={withAuth(AdminLayout)} />
      <Redirect from="/" to="admin" />
    </Switch>
  );
};
export default App;
