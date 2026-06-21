import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getInsight, getInsightSlugs, insights } from '@/lib/insights'

export function generateStaticParams() {
  return getInsightSlugs().map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const insight = getInsight(params.slug)
  if (!insight) return {}
  const title = `${insight.title} | Paul Falor`
  return {
    title,
    description: insight.dek,
    openGraph: {
      title,
      description: insight.dek,
      url: `https://paulfalor.com/insights/${insight.slug}`,
      type: 'article',
    },
    twitter: { card: 'summary_large_image', title, description: insight.dek },
  }
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December']
  return `${months[m - 1]} ${d}, ${y}`
}

export default function InsightPage({ params }: { params: { slug: string } }) {
  const insight = getInsight(params.slug)
  if (!insight) notFound()

  const related = insights.filter((i) => i.slug !== insight.slug)

  return (
    <main className="min-h-screen bg-primary-900 grid-bg">
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-12 md:py-20">
        {/* Back link */}
        <Link
          href="/#thought-leadership"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-accent transition-colors duration-200 mb-10"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All insights
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-medium uppercase tracking-wider mb-5">
            {insight.category}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-5 text-balance">
            {insight.title}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-6">
            {insight.dek}
          </p>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span>Paul Falor</span>
            <span aria-hidden>·</span>
            <span>{formatDate(insight.date)}</span>
            <span aria-hidden>·</span>
            <span>{insight.readingTimeMinutes} min read</span>
          </div>
        </header>

        {/* Body */}
        <article className="prose prose-invert prose-lg max-w-none
                        prose-headings:text-white prose-headings:font-bold
                        prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
                        prose-p:text-slate-300 prose-p:leading-relaxed
                        prose-strong:text-white
                        prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                        prose-li:text-slate-300
                        prose-blockquote:border-l-accent prose-blockquote:bg-slate-800/30
                        prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:px-5
                        prose-blockquote:not-italic prose-blockquote:text-slate-100 prose-blockquote:font-medium">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{insight.body}</ReactMarkdown>
        </article>

        {/* Sources */}
        <section className="mt-16 pt-8 border-t border-slate-700/50">
          <h2 className="text-sm font-semibold text-accent uppercase tracking-wider mb-5">
            Sources
          </h2>
          <ol className="space-y-2.5">
            {insight.sources.map((s, i) => (
              <li key={s.url} className="flex gap-3 text-sm">
                <span className="text-slate-600 shrink-0 tabular-nums">{i + 1}.</span>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-accent transition-colors duration-200 break-words"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
        </section>

        {/* Related + CTA */}
        <section className="mt-16 pt-8 border-t border-slate-700/50">
          <h2 className="text-sm font-semibold text-accent uppercase tracking-wider mb-5">
            More perspectives
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/insights/${r.slug}`}
                className="block bg-slate-800/40 border border-slate-700/50 hover:border-accent/40 rounded-xl p-5 transition-colors duration-200 group"
              >
                <div className="text-xs text-accent uppercase tracking-wider mb-2">{r.category}</div>
                <div className="text-white font-semibold group-hover:text-accent transition-colors duration-200">
                  {r.title}
                </div>
              </Link>
            ))}
          </div>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-white font-medium rounded-lg transition-colors duration-300"
          >
            Discuss this with Paul
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </section>
      </div>
    </main>
  )
}
