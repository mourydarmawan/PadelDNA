interface PlaceholderPageProps {
  title: string;
  phase: string;
}

export function PlaceholderPage({ title, phase }: PlaceholderPageProps) {
  return (
    <div className="px-5 sm:px-8 py-10 max-w-3xl">
      <h1 className="font-display text-3xl font-bold">{title}</h1>
      <p className="mt-2 text-[var(--color-mist-300)]">This module is built in {phase}.</p>
    </div>
  );
}
