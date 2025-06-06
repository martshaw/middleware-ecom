import './globals.css';

import { Button } from "../components/ui/button";
import Link from "next/link";

import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
export const metadata: Metadata = {
  title: 'E-commerce Middleware Demo',
  description: 'Event-driven Next.js 15 middleware demo for Salesforce and Shopify',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <nav className="w-full bg-white shadow mb-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <span className="text-2xl font-extrabold tracking-tight text-blue-700 cursor-pointer">Demo</span>
            </Link>
          </div>
          <div className="flex gap-2 md:gap-4" role="navigation" aria-label="Commerce Providers">
            <Link href="/products/salesforce" className="group" prefetch={false} aria-label="Browse Salesforce Products">
              <Button variant="ghost" className="rounded-full px-5 py-2 text-base font-medium group-hover:bg-blue-50 group-hover:text-blue-700 transition">Salesforce</Button>
            </Link>
            <Link href="/products/shopify" className="group" prefetch={false} aria-label="Browse Shopify Products">
              <Button variant="ghost" className="rounded-full px-5 py-2 text-base font-medium group-hover:bg-green-50 group-hover:text-green-700 transition">Shopify</Button>
            </Link>
          </div>
        </div>
      </nav>
      {children}
      <Analytics/>
      </body>
      
    </html>
  );
}
