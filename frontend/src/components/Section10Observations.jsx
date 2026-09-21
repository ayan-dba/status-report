export default function Section10Observations({ form, update, prev, onSubmit, submitting }) {
  return (
    <div className="card">
      <div className="card-title">
        §10 — Observations, Patterns & Suggestions
        <span className="badge optional">Optional</span>
      </div>
      <p className="card-desc">
        Quality signals, recurring client challenges, process improvement ideas, or knowledge gaps
        that may inform DBACoach's service offerings or content.
      </p>

      <div className="form-group" style={{ marginBottom: 24 }}>
        <label>Observations & Suggestions</label>
        <textarea
          rows={6}
          placeholder={`e.g. Three clients this week struggled with positioning their contribution to knowledge.\nSuggest creating a short template or guide.\n\nClients from Henley programme appear to need more support on examiner-specific viva conventions — possible niche coaching add-on?`}
          value={form.observations}
          onChange={(e) => update({ observations: e.target.value })}
        />
      </div>

      <hr className="section-divider" />

      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '14px 18px', marginBottom: 20 }}>
        <p style={{ fontSize: '0.82rem', color: '#166534', fontWeight: 600, marginBottom: 4 }}>Ready to submit?</p>
        <p style={{ fontSize: '0.8rem', color: '#15803d' }}>
          All sections have been completed. Click "Submit Report" to save your daily status report to the database.
        </p>
      </div>

      <div className="nav-row">
        <button className="btn btn-secondary" onClick={prev}>← Back</button>
        <button
          className="btn btn-success"
          onClick={onSubmit}
          disabled={submitting}
        >
          {submitting ? '⏳ Submitting…' : '✓ Submit Report'}
        </button>
      </div>
    </div>
  )
}
