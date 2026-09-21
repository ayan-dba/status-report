const PRIORITIES = ['High', 'Medium', 'Low']
const STATUSES = ['Done', 'In Progress', 'Scheduled', 'Pending']

const EMPTY_ROW = { task: '', priority: 'Medium', status: 'In Progress', notes: '' }

export default function Section5AdminTasks({ form, update, next, prev }) {
  const rows = form.adminTasks
  const setRows = (r) => update({ adminTasks: r })
  const addRow = () => setRows([...rows, { ...EMPTY_ROW }])
  const removeRow = (i) => setRows(rows.filter((_, idx) => idx !== i))
  const updateRow = (i, key, val) => setRows(rows.map((r, idx) => idx === i ? { ...r, [key]: val } : r))

  const priorityColor = { High: '#dc2626', Medium: '#d97706', Low: '#16a34a' }

  return (
    <div className="card">
      <div className="card-title">
        §5 — Internal & Administrative Tasks
        <span className="badge">Core</span>
      </div>
      <p className="card-desc">
        Log all internal admin work completed or in progress today — CRM updates, content reviews, performance reviews, etc.
      </p>

      {rows.length === 0 && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 12 }}>
          No admin tasks logged. Add tasks as needed.
        </p>
      )}

      {rows.map((row, i) => (
        <div className="row-card" key={i}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div className="row-num" style={{ marginBottom: 0 }}>Task #{i + 1}</div>
            {row.priority && (
              <span style={{
                fontSize: '0.72rem', fontWeight: 700, padding: '2px 9px',
                borderRadius: 20, background: `${priorityColor[row.priority]}18`,
                color: priorityColor[row.priority]
              }}>{row.priority}</span>
            )}
          </div>
          <button className="btn-remove" onClick={() => removeRow(i)}>✕</button>
          <div className="form-grid">
            <div className="form-group full">
              <label>Task Description <span className="req">*</span></label>
              <input type="text" placeholder="e.g. Team coach performance review — Coach Priya" value={row.task}
                onChange={(e) => updateRow(i, 'task', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Priority <span className="req">*</span></label>
              <select value={row.priority} onChange={(e) => updateRow(i, 'priority', e.target.value)}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Status <span className="req">*</span></label>
              <select value={row.status} onChange={(e) => updateRow(i, 'status', e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group full">
              <label>Notes</label>
              <input type="text" placeholder="Any relevant notes…" value={row.notes}
                onChange={(e) => updateRow(i, 'notes', e.target.value)} />
            </div>
          </div>
        </div>
      ))}

      <button className="btn-add" onClick={addRow}>＋ Add Task</button>

      <div className="nav-row">
        <button className="btn btn-secondary" onClick={prev}>← Back</button>
        <button className="btn btn-primary" onClick={next}>Next →</button>
      </div>
    </div>
  )
}
