interface Props {
  error: Error
}

export default function ErrorFallback({ error }: Props) {
  return (
    <div style={{
      padding: '2rem',
      background: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '0.75rem',
      color: '#ef4444',
    }}>
      <strong style={{ fontFamily: 'Syne, sans-serif' }}>Algo salió mal</strong>
      <pre style={{
        marginTop: '0.5rem',
        fontSize: '0.8rem',
        fontFamily: 'monospace',
        color: '#b91c1c',
        whiteSpace: 'pre-wrap',
      }}>
        {error.message}
      </pre>
    </div>
  )
}
