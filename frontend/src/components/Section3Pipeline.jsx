const STATUS_OPTIONS = ['On Track', 'Caution', 'At Risk', 'Escalated']

const STATUS_CLASS = {
  'On Track': 'risk-on-track',
  'Caution': 'risk-caution',
  'At Risk': 'risk-at-risk',
  'Escalated': 'risk-escalated',
}

const CHAPTERS = [
  'Research Proposal',
  'Chapter 1 — Introduction',
  'Chapter 2 — Literature Review',
  'Chapter 3 — Methodology',
  'Chapter 4 — Findings',
  'Chapter 5 — Discussion',
  'Viva Preparation',
  'Final Submission',
]

const EMPTY_ROW = {
  clientId: '', currentChapter: '', supervisorDeadline: '',
  onTrack: 'On Track', riskConcern: '', tlActionNeeded: '',
}

export default function Section3Pipeline({ form, update, next, prev }) {
  const rows = form.pipelineSnapshots
  const setRows = (r) => update({ pipelineSnapshots: r })
  const addRow = () => setRows([...rows, { ...EMPTY_ROW }])
  const removeRow = (i) => setRows(rows.filter((_, idx) => idx !== i))
  const updateRow = (i, key, val) => setRows(rows.map((r, idx) => idx === i ? { ...r, [key]: val } : r))

  return (
    <div className="card">
      <div className="card-title">
        §3 — Client Dissertation Pipeline — Progress Snapshot
        <span className="badge">Core</span>
      </div>
      <p className="card-desc">
        Health-check across your entire active client list. Flag any client at risk of stalling or missing a supervisor deadline.
      </p>

      {rows.length === 0 && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 12 }}>
          No pipeline entries yet. Add each active client.
        </p>
      )}

      {rows.map((row, i) => (
        <div className="row-card" key={i}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div className="row-num" style={{ marginBottom: 0 }}>Client #{i + 1}</div>
            {row.onTrack && (
              <span className={`risk-badge ${STATUS_CLASS[row.onTrack] || ''}`}>{row.onTrack}</span>
            )}
          </div>
          <button className="btn-remove" onClick={() => removeRow(i)}>✕</button>
          <div className="form-grid cols-3">
            <div className="form-group">
              <label>Client ID / Name <span className="req">*</span></label>
              <input type="text" placeholder="e.g. Client #A14" value={row.clientId}
                onChange={(e) => updateRow(i, 'clientId', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Current Chapter <span className="req">*</span></label>
              <select value={row.currentChapter} onChange={(e) => updateRow(i, 'currentChapter', e.target.value)}>
                <option value="">Select chapter…</option>
                {CHAPTERS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Supervisor Deadline <span className="req">*</span></label>
              <input type="date" value={row.supervisorDeadline}
                onChange={(e) => updateRow(i, 'supervisorDeadline', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Status <span className="req">*</span></label>
              <select value={row.onTrack} onChange={(e) => updateRow(i, 'onTrack', e.target.value)}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Risk / Concern</label>
              <input type="text" placeholder="Describe any risk…" value={row.riskConcern}
                onChange={(e) => updateRow(i, 'riskConcern', e.target.value)} />
            </div>
            <div className="form-group">
              <label>TL Action Needed</label>
              <input type="text" placeholder="e.g. Escalation email sent" value={row.tlActionNeeded}
                onChange={(e) => updateRow(i, 'tlActionNeeded', e.target.value)} />
            </div>
          </div>
        </div>
      ))}

      <button className="btn-add" onClick={addRow}>＋ Add Client to Pipeline</button>

      <div className="nav-row">
        <button className="btn btn-secondary" onClick={prev}>← Back</button>
        <button className="btn btn-primary" onClick={next}>Next →</button>
      </div>
    </div>
  )
}
