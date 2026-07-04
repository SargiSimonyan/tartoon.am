export function PageHeader({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="max-w-2xl">
      <div className="dim-line dim-line-left mb-5 text-oak">
        <span>{label}</span>
      </div>
      <h1 className="font-display text-4xl leading-tight tracking-tight text-ink md:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="mt-4 text-ink/70 md:text-lg md:leading-relaxed">
          {description}
        </p>
      )}
    </header>
  );
}
