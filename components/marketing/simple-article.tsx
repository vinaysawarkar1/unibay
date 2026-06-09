export type ArticleSection = {
  heading?: string
  paragraphs?: string[]
  list?: string[]
}

export function SimpleArticle({
  title,
  paragraphs,
  intro,
  lastUpdated,
  sections,
}: {
  title: string
  paragraphs?: string[]
  intro?: string
  lastUpdated?: string
  sections?: ArticleSection[]
}) {
  return (
    <div className="container mx-auto px-4 lg:px-6 py-24 lg:py-28 max-w-3xl">
      <h1 className="text-4xl font-bold mb-3">{title}</h1>

      {lastUpdated && (
        <p className="text-sm text-muted-foreground mb-8">Last updated: {lastUpdated}</p>
      )}

      {intro && (
        <p className="text-lg text-muted-foreground leading-relaxed mb-10 border-l-2 border-primary/40 pl-4">
          {intro}
        </p>
      )}

      {paragraphs && paragraphs.length > 0 && (
        <div className="space-y-4 text-muted-foreground leading-relaxed mb-10">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      {sections && sections.length > 0 && (
        <div className="space-y-10">
          {sections.map((s, i) => (
            <section key={i}>
              {s.heading && (
                <h2 className="text-xl font-semibold text-foreground mb-3">{s.heading}</h2>
              )}
              {s.paragraphs && s.paragraphs.length > 0 && (
                <div className="space-y-3 text-muted-foreground leading-relaxed">
                  {s.paragraphs.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              )}
              {s.list && s.list.length > 0 && (
                <ul className="mt-3 space-y-2 text-muted-foreground">
                  {s.list.map((it, j) => (
                    <li key={j} className="flex gap-2.5 leading-relaxed">
                      <span className="text-primary mt-0.5 shrink-0">›</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
