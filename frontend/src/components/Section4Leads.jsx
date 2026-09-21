const LEAD_STATUS = ['Call Scheduled', 'Awaiting Reply', 'Proposal Sent', 'Onboarded', 'Declined']

const SOURCES = [
  'Website Form', 'Referral', 'LinkedIn', 'Google Ad', 'Word of Mouth',
  'Social Media', 'Email Campaign', 'Other',
]

const ENQUIRY_TYPES = [
  'Full Dissertation Coaching Package',
  'Chapter Review Only',
  'Viva Preparation',
  'Proposal Support',
  'Statistical Analysis Support',
  'General Enquiry',
]

const EMPTY_ROW = {
  leadName: '', source: '', programmeUniversity: '',
  enquiryType: '', actionTaken: '', status: 'Awaiting Reply',
}

export default function Section4Leads({ form, update, next, prev }) {
  const rows = form.leads
  const setRows = (r) => update({ leads: r })
  const addRow = () => setRows([...rows, { ...EMPTY_ROW }])
  const removeRow = (i) => setRows(rows.filter((_, idx) => idx !== i))
  const updateRow = (i, key, val) => setRows(rows.map((r, idx) => idx === i ? { ...r, [key]: val } : r))

  return (
    <div className="card">
      <div className="card-title">
        §4 — New Leads, Enquiries & Client Onboarding
        <span className="badge">Core</span>
      </div>
      <p className="card-desc">
        Log all new leads and prospective client interactions today. Write "None today" in notes if no new leads.
      </p>

      {rows.length === 0 && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 12 }}>
          No leads today. Add a row if you received an enquiry.
        </p>
      )}

      {rows.map((row, i) => (
        <div className="row-card" key={i}>
          <div className="row-num">Lead #{i + 1}</div>
          <button className="btn-remove" onClick={() => removeRow(i)}>✕</button>
          <div className="form-grid cols-3">
            <div className="form-group">
              <label>Lead Name / ID <span className="req">*</span></label>
              <input type="text" placeholder="e.g. Lead #L22 or Full Name" value={row.leadName}
                onChange={(e) => updateRow(i, 'leadName', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Source <span className="req">*</span></label>
              <select value={row.source} onChange={(e) => updateRow(i, 'source', e.target.value)}>
                <option value="">Select source…</option>
                {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Programme / University <span className="req">*</span></label>
              <input type="text" placeholder="e.g. Henley Business School — DBA" value={row.programmeUniversity}
                onChange={(e) => updateRow(i, 'programmeUniversity', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Enquiry Type <span className="req">*</span></label>
              <select value={row.enquiryType} onChange={(e) => updateRow(i, 'enquiryType', e.target.value)}>
                <option value="">Select type…</option>
                {ENQUIRY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Action Taken <span className="req">*</span></label>
              <input type="text" placeholder="e.g. Discovery call scheduled for tomorrow" value={row.actionTaken}
                onChange={(e) => updateRow(i, 'actionTaken', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Status <span className="req">*</span></label>
              <select value={row.status} onChange={(e) => updateRow(i, 'status', e.target.value)}>
                {LEAD_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      ))}

      <button className="btn-add" onClick={addRow}>＋ Add Lead</button>

      <div className="nav-row">
        <button className="btn btn-secondary" onClick={prev}>← Back</button>
        <button className="btn btn-primary" onClick={next}>Next →</button>
      </div>
    </div>
  )
}
