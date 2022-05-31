import React from 'react';
import { Head, Html, Main, NextScript } from 'next/document';

const Document = () => {
  return (
    <React.StrictMode>
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    </React.StrictMode>
  );
};

export default Document;
