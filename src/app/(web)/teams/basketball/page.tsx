export default function BasketballPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-6 lg:px-8 lg:pt-36">
      <div className="mb-12 text-center md:mb-6">
        <h1 className="font-heading text-5xl font-700 uppercase tracking-tight text-primary sm:text-6xl">
          Equipo de <span className="text-neon text-glow-neon">Básquetbol</span>
        </h1>
        <p className="mt-4 text-muted-foreground mx-auto max-w-2xl text-lg uppercase tracking-widest font-600">
          En Construccón
        </p>
      </div>
      <div className="flex min-h-[40vh] items-center justify-center rounded-3xl border border-neon/30 bg-primary/90 px-8 py-16 shadow-2xl">
        <p className="text-slate-300 text-xl font-300 text-center">
          Próximamente encontrarás aquí toda la informacón sobre nuestros
          equipos, torneos y entrenamientos de básquetbol.
        </p>
      </div>
    </div>
  );
}
