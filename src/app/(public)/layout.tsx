import { Footer, SiteHeader } from '@/components/layout'

export default function PublicLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col outline-none">
        {children}
      </main>
      <Footer />
    </>
  )
}
