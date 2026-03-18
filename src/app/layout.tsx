import type { Metadata, Viewport } from 'next'
import ThemeRegistry from '@/theme/ThemeRegistry'

export const metadata: Metadata = {
  title: 'Aprendendo Vocabulário em Inglês',
  description: 'Aprenda vocabulário em inglês com geração de palavras alimentada por IA e quizzes interativos',
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
