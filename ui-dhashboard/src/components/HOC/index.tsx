import useToken from "hooks/useToken";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

type AuthProps = {
  authenticated: boolean;
};

type WrappedProps = {
  // Props for the wrapped component go here
  authenticated: boolean;
};

function withAuth<P extends WrappedProps>(
  WrappedComponent: React.FC<P & AuthProps>
) {
  return function WithAuth(props: P) {
    const [authenticated, setAuthenticated] = useState(false);
    const { getToken } = useToken();

    const storedToken = getToken();
    const history = useHistory();
    useEffect(() => {
      if (storedToken) setAuthenticated(true);
      else {
        history.push("/auth");
        setAuthenticated(false);
      }
    }, [storedToken]);

    return <WrappedComponent authenticated={authenticated} {...props} />;
  };
}
export default withAuth;
