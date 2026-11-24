import { FileWarning } from 'lucide-react'
import type React from 'react'

import { PageIntro } from '@/components/site/PageIntro'
import { FeedbackPanel } from '@/components/ui/feedback-panel'

export type LegalSection = { id: string; title: string; body: React.ReactNode }

/*
 * Layout for policy pages (Kebijakan Privasi, Ketentuan Pendaftaran): intro, contents list,
 * numbered sections. `draft` shows a clear banner: policy text needs organisational review and
 * owner approval before launch (PRD §8.6, AC-09). Unresolved items use <Pending />.
 */
export function LegalPage({
  draft,
  intro,
  sections,
  title,
  updated,
}: {
  draft?: string
  intro: string
  sections: LegalSection[]
  title: string
  updated: string
}) {
  return (
    <div className="container-page pt-8 pb-16 lg:pb-24">
      <PageIntro intro={intro} title={title}>
        <p className="mt-4 text-meta text-slate-600">
          Terakhir diperbarui: <span className="numeric">{updated}</span>
        </p>
      </PageIntro>

      {draft ? (
        <FeedbackPanel className="mt-8 max-w-3xl" title="Draf, belum berlaku" tone="warning">
          {draft}
        </FeedbackPanel>
      ) : null}

      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-6">
        <nav aria-labelledby="daftar-isi" className="lg:col-span-3">
          <div className="lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]">
            <p className="eyebrow text-slate-600" id="daftar-isi">
              Daftar isi
            </p>
            <ol className="mt-4 flex flex-col gap-1 text-meta">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    className="inline-flex min-h-9 items-center gap-2 text-navy-800 underline-offset-4 hover:text-blue-600 hover:underline"
                    href={`#${section.id}`}
                  >
                    <span className="numeric text-slate-600">{index + 1}.</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <div className="flex max-w-[68ch] flex-col lg:col-span-8 lg:col-start-5">
          {sections.map((section, index) => (
            <section
              aria-labelledby={section.id}
              className="border-t border-line-subtle py-8 first:border-t-0 first:pt-0"
              key={section.id}
            >
              <h2 className="text-h3 text-navy-950" id={section.id}>
                <span className="numeric mr-2 text-slate-600">{index + 1}.</span>
                {section.title}
              </h2>
              <div className="mt-4 flex flex-col gap-3 text-body text-navy-800 [&_li]:pl-1 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5">
                {section.body}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Marks text that waits on an open decision, so a draft can never read as final. */
export function Pending({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-start gap-1.5 rounded-card bg-warning-surface px-2 py-1 text-meta font-medium text-warning">
      <FileWarning aria-hidden className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </span>
  )
}
