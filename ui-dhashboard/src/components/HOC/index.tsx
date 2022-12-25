import useToken from "hooks/useToken";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { RootState } from "store";
import { ROLES } from "utils/constant";

type AuthProps = {
  authenticated: boolean;
  role: string;
};

type WrappedProps = {
  // Props for the wrapped component go here
  authenticated: boolean;
  role: string;
};

function withAuth<P extends WrappedProps>(
  WrappedComponent: React.FC<P & AuthProps>
) {
  return function WithAuth(props: P) {
    const [authenticated, setAuthenticated] = useState(false);
    const { getToken } = useToken();

    const storedToken = getToken();
    const history = useHistory();
    const { moderator } = useSelector((state: RootState) => state);

    useEffect(() => {
      if (storedToken) setAuthenticated(true);
      else {
        history.push("/auth");
        setAuthenticated(false);
      }
    }, [storedToken]);

    return (
      <WrappedComponent
        authenticated={authenticated}
        role={moderator?.moderator?.adminType || ROLES.Auther}
        {...props}
      />
    );
  };
}
export default withAuth;
