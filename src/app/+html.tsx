import { ScrollViewStyleReset, useServerDocumentContext } from 'expo-router/html';
import { type PropsWithChildren } from 'react';
import { Colors } from '@/theme/colors';

/**
 * Root HTML untuk seluruh halaman web.
 * Hanya berjalan di Node.js saat server/static rendering dan tidak memiliki
 * akses ke API browser. Latar html/body memakai Colors.background agar area
 * di luar konten tidak menampilkan latar terang, dan color-scheme dark membuat
 * scrollbar browser bergaya gelap.
 */
export default function Root({ children }: PropsWithChildren) {
  const { headNodes, bodyNodes, htmlAttributes, bodyAttributes } =
    useServerDocumentContext();

  return (
    <html lang="id" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="color-scheme" content="dark" />

        <ScrollViewStyleReset />

        <style
          dangerouslySetInnerHTML={{
            __html: `html,body{background-color:${Colors.background};color-scheme:dark;}`,
          }}
        />

        {headNodes}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}
