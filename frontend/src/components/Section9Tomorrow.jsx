const PRIORITIES = ['High', 'Medium', 'Low']

const EMPTY_ROW = { plannedTask: '', clientStakeholder: '', priority: 'High', timeSlot: '' }

export default function Section9Tomorrow({ form, update, next, prev }) {
  const rows = form.tomorrowPlan
  const setRows = (r) => update({ tomorrowPlan: r })
  const addRow = () => setRows([...rows, { ...EMPTY_ROW }])
  const removeRow = (i) => setRows(rows.filter((_, idx) => idx !== i))
  const updateRow = (i, key, val) => setRows(rows.map((r, idx) => idx === i ? { ...r, [key]: val } : r))

  return (
    <div className="card">
      <div className="card-title">
        §9 — Plan for Tomorrow
        <span className="badge">Core</span>
      </div>
      <p className="card-desc">
        List all planned tasks, coaching sessions, and follow-ups for tomorrow.
        Carry-forward items from today must appear here.
      </p>

      {rows.length === 0 && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 12 }}>
          No tasks planned yet. Add tomorrow's schedule below.
        </p>
      )}

      {rows.map((row, i) => (
        <div className="row-card" key={i}>
          <div className="row-num">Task #{i + 1}</div>
          <button className="btn-remove" onClick={() => removeRow(i)}>✕</button>
          <div className="form-grid cols-3">
            <div className="form-group full">
              <label>Planned Task / Session <span className="req">*</span></label>
              <input type="text" placeholder="e.g. Discovery call — Lead #L22" value={row.plannedTask}
                onChange={(e) => updateRow(i, 'plannedTask', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Client / Stakeholder <span className="req">*</span></label>
              <input type="text" placeholder="e.g. Lead #L22" value={row.clientStakeholder}
                onChange={(e) => updateRow(i, 'clientStakeholder', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Priority <span className="req">*</span></label>
              <select value={row.priority} onChange={(e) => updateRow(i, 'priority', e.target.value)}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Time Slot</label>
              <input type="time" value={row.timeSlot}
                onChange={(e) => updateRow(i, 'timeSlot', e.target.value)} />
            </div>
          </div>
        </div>
      ))}

      <button className="btn-add" onClick={addRow}>＋ Add Planned Task</button>

      <div className="nav-row">
        <button className="btn btn-secondary" onClick={prev}>← Back</button>
        <button className="btn btn-primary" onClick={next}>Next →</button>
      </div>
    </div>
  )
}
