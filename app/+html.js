import { ScrollViewStyleReset, useServerDocumentContext } from 'expo-router/html';

const APP_BACKGROUND = '#F5F5EF';

export default function Root({ children }) {
  const { bodyAttributes, bodyNodes, htmlAttributes, headNodes } =
    useServerDocumentContext();

  return (
    <html lang="en" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#10120D" />
        <meta name="color-scheme" content="light" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <style>{`
          html, body, #root {
            background-color: ${APP_BACKGROUND};
            min-height: 100%;
          }
          html, body, #root, button, input, textarea, select {
            font-family: 'Nunito_400Regular', system-ui, sans-serif;
          }
          body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
            overscroll-behavior-y: none;
          }
          ::selection {
            background-color: #D8FF4F;
            color: #10120D;
          }
        `}</style>
        <ScrollViewStyleReset />
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}
