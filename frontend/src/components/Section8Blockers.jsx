export default function Section8Blockers({ form, update, next, prev }) {
  return (
    <div className="card">
      <div className="card-title">
        §8 — Blockers, Escalations & Urgent Issues
        <span className="badge">Required</span>
      </div>
      <p className="card-desc">
        Flag anything that requires management input, a policy decision, or immediate action.
        If none, the default text is sufficient.
      </p>

      <div className="form-group" style={{ marginBottom: 16 }}>
        <label>Blockers / Escalations <span className="req">*</span></label>
        <textarea
          rows={6}
          placeholder={`Describe each blocker on a separate line:\n— Client issue\n— Team issue\n— Process gap\n— Tool/resource need\n— Billing or payment concern`}
          value={form.blockers}
          onChange={(e) => update({ blockers: e.target.value })}
        />
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button
          className="btn btn-secondary"
          style={{ fontSize: '0.78rem', padding: '6px 14px' }}
          onClick={() => update({ blockers: 'No blockers or escalations today.' })}
        >
          ✓ Set as "None today"
        </button>
      </div>

      <div className="nav-row">
        <button className="btn btn-secondary" onClick={prev}>← Back</button>
        <button className="btn btn-primary" onClick={next}>Next →</button>
      </div>
    </div>
  )
}
