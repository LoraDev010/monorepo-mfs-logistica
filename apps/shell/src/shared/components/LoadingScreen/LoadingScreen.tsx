export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-36 gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-border border-t-brand animate-spin" />
      <p className="text-text-secondary text-sm font-body">Cargando módulo…</p>
    </div>
  )
}

