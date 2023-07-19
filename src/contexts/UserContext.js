import React, { useEffect, useState } from "react";
import { authVerify } from "../api/endpoints/auth";
import { UserContext } from "./Context";
import { useCookies } from "react-cookie";
import { sampleUser } from "../libs/data/user";

export const PropsProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["token", "user"]);

  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(cookies.token);
  const [user, setUser] = useState(sampleUser);
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (loading) {
      onLoad();
    }
    // eslint-disable-next-line
  }, [loading]);

  useEffect(() => {
    setAuthenticated(token && user.id ? true : false);
    setIsAdmin(user.isAdmin ? true : false);
  }, [token, user]);

  useEffect(() => {
    if (token) return setCookie("token", token, { path: "/" });

    if (!authenticated) {
      onLoad();
    }
    // eslint-disable-next-line
  }, [authenticated, token, user]);

  const onLoad = async () => {
    if (token) {
      const resultVerify = await authVerify(token);

      if (resultVerify) {
        setUser(resultVerify?.data);
        setProducts(resultVerify?.data?.products);
        setToken(resultVerify?.token);
      }
    } else {
      onReset();
    }
    setLoading(false);
  };

  const onReset = () => {
    setUser(sampleUser);
    setProducts([]);

    removeCookie("token", { path: "/" });

    setToken("");
    setAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <>
      <UserContext.Provider
        value={{
          cookies,
          authenticated,
          loading,
          token,
          user,
          isAdmin,
          products,
          setCookie,
          setAuthenticated,
          setLoading,
          setToken,
          setUser,
          onReset,
          setProducts,
        }}
      >
        {children}
      </UserContext.Provider>
    </>
  );
};

export default PropsProvider;
