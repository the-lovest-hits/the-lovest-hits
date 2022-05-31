import React from 'react';
import { Head, Html, Main, NextScript } from 'next/document';

const Document = () => {
  return (
    <React.StrictMode>
      <Html>
        <Head>
          {/* eslint-disable-next-line @next/next/no-title-in-document-head */}
          <title>The lovest hits - main page</title>
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
