import { NextSeo } from 'next-seo'
import NextHead from 'next/head'

export function CustomHead({ title = '', description, image, keywords }) {
  return (
    <>
      <NextHead>
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta httpEquiv="x-dns-prefetch-control" content="off" />
        <meta httpEquiv="Window-Target" content="_value" />
        <title>{title}</title>
        <meta
          name="robots"
          content={
            process.env.NODE_ENV !== 'development'
              ? 'index,follow'
              : 'noindex,nofollow'
          }
        />
        <meta
          name="googlebot"
          content={
            process.env.NODE_ENV !== 'development'
              ? 'index,follow'
              : 'noindex,nofollow'
          }
        />

        <meta
          name="keywords"
          content={keywords && keywords.length ? keywords.join(',') : keywords}
        />
        <meta name="geo.region" content="IN" />

        {/* START FAVICON */}
        <link rel="manifest" href="/site.webmanifest" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ff98a2" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="author" content="Mahavishnu K" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" />
        {/* END FAVICON */}
      </NextHead>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          title,
          description,
          type: 'website',
          locale: 'en_IN',
          images: [
            {
              url: image
                ? image.url
                : 'https://mahavishnu-k.vercel.app/og.png',
              width: image ? image.width : 1200,
              height: image ? image.height : 630,
              alt: title,
            },
          ],
          defaultImageWidth: 1200,
          defaultImageHeight: 630,
          site_name: 'Mahavishnu K - Developer Portfolio',
        }}
        twitter={{
          handle: '@mahavishnu_07',
          cardType: 'summary_large_image',
        }}
      />
    </>
  )
}
