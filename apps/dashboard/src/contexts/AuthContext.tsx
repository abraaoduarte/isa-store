import React, { createContext, FC, useEffect, useState } from 'react';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import Router from 'next/router';
import { api } from 'services/api';
import { User } from 'interfaces/api';

type SignInData = {
  email: string;
  password: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User;
  signIn: (data: SignInData) => Promise<void>;
};

const AuthContext = createContext({} as AuthContextType);

const { Provider } = AuthContext;

const AuthProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({} as User);

  const isAuthenticated = !!user;

  useEffect(() => {
    const { token: token } = parseCookies();

    if (token) {
      api
        .get('users/retrieve')
        .then(({ data }) => {
          setUser(data.result);
        })
        .catch(() => {
          setUser({} as User);
          destroyCookie(undefined, 'token');
          destroyCookie(undefined, 'user');
        });
    }
  }, []);

  async function signIn(formData: SignInData) {
    const { data } = await api.post('auth/login', formData);

    setCookie(undefined, 'token', data.result.token, {
      maxAge: 60 * 60 * 4,
    });

    setCookie(undefined, 'user', data.result.user, {
      maxAge: 60 * 60 * 4,
    });

    api.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${data.result.token}`;

    setUser(user);

    Router.push('/');
  }

  return (
    <Provider value={{ user, isAuthenticated, signIn }}>{children}</Provider>
  );
};

export { AuthContext, AuthProvider };
