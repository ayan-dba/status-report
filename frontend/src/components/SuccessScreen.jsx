export default function SuccessScreen({ id, onReset }) {
  return (
    <div className="card success-screen">
      <div className="success-icon">✅</div>
      <h2>Report Submitted Successfully</h2>
      <p style={{ marginTop: 8 }}>
        Your daily status report has been saved to the database.
      </p>
      {id && (
        <p style={{ marginTop: 8, fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
          Report ID: {id}
        </p>
      )}
      <div style={{ marginTop: 32, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          className="btn btn-primary"
          onClick={onReset}
        >
          ＋ Submit Another Report
        </button>
      </div>
      <p style={{ marginTop: 28, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        DBA Coach · Daily Status Report · For internal use only · dbacoach.com
      </p>
    </div>
  )
}
