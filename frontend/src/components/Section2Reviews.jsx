const REVIEW_TYPES = [
  'Full Structural Review',
  'First-Pass Read',
  'Language & Grammar Check',
  'Methodology Review',
  'Supervisor Feedback Review',
  'Final Proof Read',
]

const EMPTY_ROW = {
  clientId: '', documentChapter: '', version: '',
  reviewType: '', feedbackSent: false, keyIssuesFlagged: '',
}

export default function Section2Reviews({ form, update, next, prev }) {
  const rows = form.chapterReviews
  const setRows = (r) => update({ chapterReviews: r })
  const addRow = () => setRows([...rows, { ...EMPTY_ROW }])
  const removeRow = (i) => setRows(rows.filter((_, idx) => idx !== i))
  const updateRow = (i, key, val) => setRows(rows.map((r, idx) => idx === i ? { ...r, [key]: val } : r))

  return (
    <div className="card">
      <div className="card-title">
        §2 — Chapter & Deliverable Reviews Completed
        <span className="badge">Required</span>
      </div>
      <p className="card-desc">
        Log every draft chapter, proposal section, or research document reviewed and returned today.
        If none: leave this section empty.
      </p>

      {rows.length === 0 && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 12 }}>
          No reviews conducted today. Add a row if applicable.
        </p>
      )}

      {rows.map((row, i) => (
        <div className="row-card" key={i}>
          <div className="row-num">Review #{i + 1}</div>
          <button className="btn-remove" onClick={() => removeRow(i)}>✕</button>
          <div className="form-grid">
            <div className="form-group">
              <label>Client <span className="req">*</span></label>
              <input type="text" placeholder="e.g. Client #C03" value={row.clientId}
                onChange={(e) => updateRow(i, 'clientId', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Document / Chapter <span className="req">*</span></label>
              <input type="text" placeholder="e.g. Chapter 4 — Findings" value={row.documentChapter}
                onChange={(e) => updateRow(i, 'documentChapter', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Version <span className="req">*</span></label>
              <input type="text" placeholder="e.g. v2" value={row.version}
                onChange={(e) => updateRow(i, 'version', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Review Type <span className="req">*</span></label>
              <select value={row.reviewType} onChange={(e) => updateRow(i, 'reviewType', e.target.value)}>
                <option value="">Select…</option>
                {REVIEW_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group full">
              <label>Key Issues Flagged</label>
              <textarea placeholder="Describe issues flagged in the document…" value={row.keyIssuesFlagged}
                onChange={(e) => updateRow(i, 'keyIssuesFlagged', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Feedback Sent?</label>
              <div className="toggle-wrap" style={{ marginTop: 4 }}>
                <label className="toggle">
                  <input type="checkbox" checked={row.feedbackSent}
                    onChange={(e) => updateRow(i, 'feedbackSent', e.target.checked)} />
                  <span className="toggle-slider"></span>
                </label>
                <span style={{ fontSize: '0.85rem', color: row.feedbackSent ? 'var(--success)' : 'var(--text-muted)' }}>
                  {row.feedbackSent ? 'Sent' : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button className="btn-add" onClick={addRow}>＋ Add Review</button>

      <div className="nav-row">
        <button className="btn btn-secondary" onClick={prev}>← Back</button>
        <button className="btn btn-primary" onClick={next}>Next →</button>
      </div>
    </div>
  )
}
