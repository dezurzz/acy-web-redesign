import type { Metadata } from 'next'
import Link from 'next/link'

import { decisionsApplied, launchStateLabel, sitemap, templates, type SitemapNode } from './_data'

export const metadata: Metadata = { title: 'Sitemap dan wireframe' }

function Tree({ nodes, depth = 0 }: { nodes: SitemapNode[]; depth?: number }) {
  return (
    <ul className={depth ? 'mt-2 space-y-2 border-l border-line-control pl-4' : 'space-y-2'}>
      {nodes.map((n) => (
        <li key={n.label}>
          <div className="rounded-sm border border-line-subtle p-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-ui font-semibold text-navy-950">
                {n.wireframe ? (
                  <Link className="underline underline-offset-4" href={n.wireframe}>
                    {n.label}
                  </Link>
                ) : (
                  n.label
                )}
              </span>
              <span
                className={
                  n.state === 'launch'
                    ? 'text-meta text-slate-600'
                    : 'rounded-sm border border-dashed border-blue-600 bg-blue-50 px-2 text-meta text-navy-800'
                }
              >
                {launchStateLabel[n.state]}
              </span>
            </div>
            <p className="mt-1 font-mono text-meta break-all text-navy-800">{n.route}</p>
            <p className="text-meta text-slate-600">
              {n.place}
              {n.ref ? ` · ${n.ref}` : ''}
            </p>
          </div>
          {n.children ? <Tree depth={depth + 1} nodes={n.children} /> : null}
        </li>
      ))}
    </ul>
  )
}

// Phase 1 entry point: sitemap plus links to the six core template wireframes.
export default function WireframesIndex() {
  return (
    <div className="container-page space-y-16 py-12">
      <header className="max-w-3xl">
        <p className="eyebrow text-slate-600">Fase 1 · 30 Nov – 11 Des 2026</p>
        <h1 className="mt-2 text-h1 text-navy-950">Sitemap dan wireframe</h1>
        <p className="mt-4 text-intro text-navy-800">
          Wireframe low-fidelity untuk enam template inti. Tujuannya menyepakati struktur dan alur,
          bukan warna atau gaya. Semua data adalah contoh. Kotak bergaris biru putus-putus adalah
          catatan untuk peninjau.
        </p>
      </header>

      <section aria-labelledby="wf-templates">
        <h2 className="text-h2 text-navy-950" id="wf-templates">
          Enam template inti
        </h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <li className="rounded-sm border border-line-subtle p-5" key={t.slug}>
              <p className="text-h3 text-navy-950">{t.name}</p>
              <p className="mt-1 font-mono text-meta text-slate-600">{t.route}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-ui font-semibold">
                <Link className="underline underline-offset-4" href={`/wireframes/${t.slug}`}>
                  Buka
                </Link>
                <Link
                  className="underline underline-offset-4"
                  href={`/wireframes/bandingkan?p=${t.slug}`}
                >
                  Mobile + desktop
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="wf-sitemap">
        <h2 className="text-h2 text-navy-950" id="wf-sitemap">
          Sitemap
        </h2>
        <p className="mt-2 max-w-3xl text-body text-navy-800">
          Berdasarkan PRD §5, diperbarui dengan keputusan Fase 0. Navigasi utama: Pelatihan, Jadwal,
          In-house Training, Tentang Kami. Aksi header: Hubungi Kami.
        </p>
        <div className="mt-6 max-w-3xl">
          <Tree nodes={sitemap} />
        </div>
      </section>

      <section aria-labelledby="wf-decisions">
        <h2 className="text-h2 text-navy-950" id="wf-decisions">
          Keputusan yang dipakai
        </h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-xl border-collapse text-left text-meta">
            <thead>
              <tr className="border-b border-line-control">
                <th className="py-2 pr-4">ID</th>
                <th className="py-2 pr-4">Dipakai di wireframe sebagai</th>
                <th className="py-2">Sumber</th>
              </tr>
            </thead>
            <tbody>
              {decisionsApplied.map(([id, text, source]) => (
                <tr className="border-b border-line-subtle align-top" key={id}>
                  <td className="py-2 pr-4 font-semibold">{id}</td>
                  <td className="py-2 pr-4">{text}</td>
                  <td className="py-2">{source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
