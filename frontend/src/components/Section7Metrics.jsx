const METRIC_FIELDS = [
  { key: 'sessionsHeld', label: 'Coaching Sessions Held' },
  { key: 'draftsReviewed', label: 'Chapter Drafts Reviewed' },
  { key: 'feedbackSent', label: 'Feedback Docs Sent' },
  { key: 'newLeadsReceived', label: 'New Leads Received' },
  { key: 'clientsAtRisk', label: 'Clients at Risk' },
  { key: 'totalActiveClients', label: 'Total Active Clients' },
]

export default function Section7Metrics({ form, update, next, prev }) {
  const metrics = form.metrics

  const setMetric = (key, val) => update({ metrics: { ...metrics, [key]: val } })

  return (
    <div className="card">
      <div className="card-title">
        §7 — Daily Operational Metrics
        <span className="badge">Core</span>
      </div>
      <p className="card-desc">
        Enter actual numbers — no estimates. These are pulled from your work today across all sections.
      </p>

      <div className="metrics-grid">
        {METRIC_FIELDS.map(({ key, label }) => (
          <div className="metric-box" key={key}>
            <label>{label}</label>
            <input
              type="number"
              min="0"
              value={metrics[key]}
              onChange={(e) => setMetric(key, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="nav-row">
        <button className="btn btn-secondary" onClick={prev}>← Back</button>
        <button className="btn btn-primary" onClick={next}>Next →</button>
      </div>
    </div>
  )
}
