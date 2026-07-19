import type { Metadata } from 'next';
import './globals.css';
import LayoutWrapper from '@/components/LayoutWrapper';
import ToastProvider from '@/components/ToastProvider';

export const metadata: Metadata = {
  title: 'SellPilot.ai – AI-Powered E-Commerce Publisher',
  description:
    'Connect your Etsy and Amazon accounts, optimize product listings with AI, and publish in one click. Save hours of manual work.',
  keywords: 'etsy, amazon, ecommerce, product listing, AI, seller tool',
  openGraph: {
    title: 'SellPilot.ai',
    description: 'AI-Powered E-Commerce Publisher for Etsy & Amazon',
    type: 'website',
  },
  icons: {
    icon: '/logo.png', // Logo used as favicon
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <ToastProvider />
      </body>
    </html>
  );
}
