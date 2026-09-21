const STAGES = [
  'Stage 1 — Research Proposal & Topic Selection',
  'Stage 2 — Chapter 1: Introduction & Research Problem',
  'Stage 3 — Chapter 2: Literature Review',
  'Stage 4 — Chapter 3: Research Methodology',
  'Stage 5 — Chapter 4: Data & Findings',
  'Stage 6 — Chapter 5: Discussion & Conclusion',
  'Stage 7 — Viva Preparation & Submission',
]

const INTERACTION_TYPES = [
  '1-on-1 Coaching Call',
  'Group Session',
  'Async — Chapter Review',
  'Email Exchange',
  'Video Call',
  'WhatsApp / Messaging',
  'Mock Viva Session',
]

const EMPTY_ROW = {
  clientId: '', dissertationStage: '', interactionType: '',
  duration: '', keyDiscussion: '', nextStep: '',
}

export default function Section1Engagement({ form, update, next, prev }) {
  const rows = form.clientEngagements

  const setRows = (rows) => update({ clientEngagements: rows })

  const addRow = () => setRows([...rows, { ...EMPTY_ROW }])

  const removeRow = (i) => setRows(rows.filter((_, idx) => idx !== i))

  const updateRow = (i, key, val) => {
    const updated = rows.map((r, idx) => idx === i ? { ...r, [key]: val } : r)
    setRows(updated)
  }

  return (
    <div className="card">
      <div className="card-title">
        §1 — Client Engagement: Sessions & Interactions Today
        <span className="badge">Required</span>
      </div>
      <p className="card-desc">
        Record every DBA candidate interaction today. One entry per client.
      </p>

      {rows.length === 0 && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 12 }}>
          No interactions logged yet. Click "Add Interaction" to begin.
        </p>
      )}

      {rows.map((row, i) => (
        <div className="row-card" key={i}>
          <div className="row-num">Interaction #{i + 1}</div>
          <button className="btn-remove" onClick={() => removeRow(i)} title="Remove">✕</button>
          <div className="form-grid cols-3">
            <div className="form-group">
              <label>Client ID / Name <span className="req">*</span></label>
              <input type="text" placeholder="e.g. Client #A14" value={row.clientId}
                onChange={(e) => updateRow(i, 'clientId', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Dissertation Stage <span className="req">*</span></label>
              <select value={row.dissertationStage} onChange={(e) => updateRow(i, 'dissertationStage', e.target.value)}>
                <option value="">Select stage…</option>
                {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Interaction Type <span className="req">*</span></label>
              <select value={row.interactionType} onChange={(e) => updateRow(i, 'interactionType', e.target.value)}>
                <option value="">Select type…</option>
                {INTERACTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Duration <span className="req">*</span></label>
              <input type="text" placeholder="e.g. 60 min" value={row.duration}
                onChange={(e) => updateRow(i, 'duration', e.target.value)} />
            </div>
            <div className="form-group full">
              <label>Key Discussion / Action <span className="req">*</span></label>
              <textarea placeholder="Summarise what was discussed and any actions taken…" value={row.keyDiscussion}
                onChange={(e) => updateRow(i, 'keyDiscussion', e.target.value)} />
            </div>
            <div className="form-group full">
              <label>Next Step <span className="req">*</span></label>
              <input type="text" placeholder="e.g. Client to revise Section 3.2 by Friday" value={row.nextStep}
                onChange={(e) => updateRow(i, 'nextStep', e.target.value)} />
            </div>
          </div>
        </div>
      ))}

      <button className="btn-add" onClick={addRow}>＋ Add Interaction</button>

      <div className="nav-row">
        <button className="btn btn-secondary" onClick={prev}>← Back</button>
        <button className="btn btn-primary" onClick={next}>Next →</button>
      </div>
    </div>
  )
}
