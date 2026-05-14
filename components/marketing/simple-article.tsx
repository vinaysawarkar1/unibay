export function SimpleArticle({
  title,
  paragraphs,
}: {
  title: string
  paragraphs: string[]
}) {
  return (
    <div className="container mx-auto px-4 lg:px-6 py-24 lg:py-28 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8">{title}</h1>
      <div className="space-y-4 text-muted-foreground leading-relaxed">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  )
}
