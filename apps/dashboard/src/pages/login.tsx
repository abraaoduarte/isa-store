import * as React from 'react';
import LoginTemplate from 'templates/Login';
import Head from 'next/head';

export default function Login() {
  return (
    <>
      <Head>
        <title>Login - Isa Duarte Store</title>
      </Head>
      <LoginTemplate />
    </>
  );
}
