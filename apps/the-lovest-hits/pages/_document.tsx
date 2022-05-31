import React from 'react';
import { Head, Html, Main, NextScript } from 'next/document';

const Document = () => {
  return (
    <React.StrictMode>
      <Html>
        <Head>
          <link rel="stylesheet" href="/assets/styles/main.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    </React.StrictMode>
  );
};

export default Document;
