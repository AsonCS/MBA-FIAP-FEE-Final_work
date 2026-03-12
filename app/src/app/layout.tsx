import type { Metadata, Viewport } from 'next'
import ThemeRegistry from '@/theme/ThemeRegistry'

export const metadata: Metadata = {
  title: 'English Vocabulary Learning App',
  description: 'Learn English vocabulary with AI-powered word generation and interactive quizzes',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1976d2',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  )
}
