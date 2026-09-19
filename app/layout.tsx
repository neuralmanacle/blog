import type { Metadata } from 'next'
import './globals.css'
import Navbar from '../components/navbar'
import Footer from '@/components/footer'
import SearchMenu from '@/components/search-menu'
import { ThemeProvider } from '@/components/theme-provider'
import { SupabaseDataProvider } from '@/components/supabase-provider'
import { SpacetimeBackground } from '@/components/spacetime-background'

export const metadata: Metadata = {
  title: {
    default: 'Neural Manacle',
    template: '%s | Neural Manacle'
  },
  description: 'Audio Software Engineer focused on DSP, C++, JUCE, computational music synthesis, and game audio.',
  metadataBase: new URL('https://neuralmanacle.blog'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Neural Manacle',
    description: 'A technical notebook for audio software engineering experiments, reading, and future projects.',
    url: 'https://neuralmanacle.blog',
    siteName: 'Neural Manacle',
    locale: 'en_US',
    type: 'website',
    images: ['/logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Neural Manacle',
    description: 'A technical notebook for audio software engineering experiments, reading, and future projects.',
    images: ['/logo.png'],
  }
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&family=Rozha+One&display=swap"
          rel="stylesheet"
        />
        <style>{`
:root {
  --font-sans: "Geist", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  --font-mono: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
html { font-family: var(--font-mono); }
        `}</style>
      </head>
      <body className="min-h-dvh bg-[#0D0D0D] text-[#F2F2F2] antialiased" suppressHydrationWarning={true}>
        <SupabaseDataProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <SpacetimeBackground />
            <Navbar />
            {children}
            <Footer />
            <SearchMenu />
          </ThemeProvider>
        </SupabaseDataProvider>
      </body>
    </html>
  )
}