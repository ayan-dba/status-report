const BANDWIDTH_OPTIONS = ['Low', 'Moderate', 'High Load']

const EMPTY_ROW = { coachName: '', availableToday: true, activeClients: '', bandwidth: 'Moderate', notes: '' }

export default function Section6TeamCapacity({ form, update, next, prev }) {
  const rows = form.teamCapacity
  const setRows = (r) => update({ teamCapacity: r })
  const addRow = () => setRows([...rows, { ...EMPTY_ROW }])
  const removeRow = (i) => setRows(rows.filter((_, idx) => idx !== i))
  const updateRow = (i, key, val) => setRows(rows.map((r, idx) => idx === i ? { ...r, [key]: val } : r))

  const bandwidthColor = { 'Low': '#16a34a', 'Moderate': '#d97706', 'High Load': '#dc2626' }

  return (
    <div className="card">
      <div className="card-title">
        §6 — Team / Coach Availability & Capacity
        <span className="badge">Core</span>
      </div>
      <p className="card-desc">
        Log availability and current load for all coaches on your team today.
      </p>

      {rows.length === 0 && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 12 }}>
          No team members logged. Add your coaches below.
        </p>
      )}

      {rows.map((row, i) => (
        <div className="row-card" key={i}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div className="row-num" style={{ marginBottom: 0 }}>{row.coachName || `Coach #${i + 1}`}</div>
            {row.bandwidth && (
              <span style={{
                fontSize: '0.72rem', fontWeight: 700, padding: '2px 9px', borderRadius: 20,
                background: `${bandwidthColor[row.bandwidth]}18`, color: bandwidthColor[row.bandwidth]
              }}>{row.bandwidth}</span>
            )}
            {!row.availableToday && (
              <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 9px', borderRadius: 20, background: '#fce7f3', color: '#9d174d' }}>
                On Leave
              </span>
            )}
          </div>
          <button className="btn-remove" onClick={() => removeRow(i)}>✕</button>
          <div className="form-grid cols-3">
            <div className="form-group">
              <label>Coach / Team Member <span className="req">*</span></label>
              <input type="text" placeholder="e.g. Coach Priya S." value={row.coachName}
                onChange={(e) => updateRow(i, 'coachName', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Active Clients</label>
              <input type="number" min="0" placeholder="0" value={row.activeClients}
                onChange={(e) => updateRow(i, 'activeClients', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Bandwidth <span className="req">*</span></label>
              <select value={row.bandwidth} onChange={(e) => updateRow(i, 'bandwidth', e.target.value)}>
                {BANDWIDTH_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Available Today</label>
              <div className="toggle-wrap" style={{ marginTop: 4 }}>
                <label className="toggle">
                  <input type="checkbox" checked={row.availableToday}
                    onChange={(e) => updateRow(i, 'availableToday', e.target.checked)} />
                  <span className="toggle-slider"></span>
                </label>
                <span style={{ fontSize: '0.85rem', color: row.availableToday ? 'var(--success)' : 'var(--danger)' }}>
                  {row.availableToday ? 'Available' : 'On Leave / Unavailable'}
                </span>
              </div>
            </div>
            <div className="form-group full">
              <label>Notes</label>
              <input type="text" placeholder="e.g. Can take 1 new client / Cover needed" value={row.notes}
                onChange={(e) => updateRow(i, 'notes', e.target.value)} />
            </div>
          </div>
        </div>
      ))}

      <button className="btn-add" onClick={addRow}>＋ Add Team Member</button>

      <div className="nav-row">
        <button className="btn btn-secondary" onClick={prev}>← Back</button>
        <button className="btn btn-primary" onClick={next}>Next →</button>
      </div>
    </div>
  )
}
