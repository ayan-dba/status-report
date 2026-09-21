import { useState } from 'react'

const AVAILABILITY_OPTIONS = [
  'Full Day', 'Half Day', 'WFH', 'OOO', 'WFH – Half Day',
]

const VERTICALS = [
  'Strategy & Leadership',
  'Human Resource Management',
  'Finance & Accounting',
  'Healthcare Management',
  'Marketing & Innovation',
  'Operations Management',
  'Entrepreneurship',
  'Information Systems',
  'Other',
]

export default function Section0Identity({ form, update, next }) {
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.teamLeadName.trim()) e.teamLeadName = 'Required'
    if (!form.reportingDate) e.reportingDate = 'Required'
    if (!form.vertical) e.vertical = 'Required'
    if (!form.activeClientPortfolio) e.activeClientPortfolio = 'Required'
    if (!form.availabilityToday) e.availabilityToday = 'Required'
    if (!form.submissionTime) e.submissionTime = 'Required'
    return e
  }

  const handleNext = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    next()
  }

  const field = (key) => ({
    value: form[key],
    onChange: (ev) => { update({ [key]: ev.target.value }); setErrors((prev) => ({ ...prev, [key]: undefined })) },
    className: errors[key] ? 'error' : '',
  })

  return (
    <div className="card">
      <div className="card-title">
        Report Identity
        <span className="badge">Required</span>
      </div>
      <p className="card-desc">Basic information about the team lead and this report submission.</p>

      <div className="form-grid">
        <div className="form-group">
          <label>Team Lead Name <span className="req">*</span></label>
          <input type="text" placeholder="Full Name" {...field('teamLeadName')} />
          {errors.teamLeadName && <span className="error-msg">{errors.teamLeadName}</span>}
        </div>

        <div className="form-group">
          <label>Reporting Date <span className="req">*</span></label>
          <input type="date" {...field('reportingDate')} />
          {errors.reportingDate && <span className="error-msg">{errors.reportingDate}</span>}
        </div>

        <div className="form-group">
          <label>Vertical / Specialisation <span className="req">*</span></label>
          <select {...field('vertical')}>
            <option value="">Select vertical…</option>
            {VERTICALS.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
          {errors.vertical && <span className="error-msg">{errors.vertical}</span>}
        </div>

        <div className="form-group">
          <label>Active Client Portfolio <span className="req">*</span></label>
          <input type="number" min="0" placeholder="No. of active DBA candidates" {...field('activeClientPortfolio')} />
          {errors.activeClientPortfolio && <span className="error-msg">{errors.activeClientPortfolio}</span>}
        </div>

        <div className="form-group">
          <label>Availability Today <span className="req">*</span></label>
          <select {...field('availabilityToday')}>
            <option value="">Select…</option>
            {AVAILABILITY_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
          {errors.availabilityToday && <span className="error-msg">{errors.availabilityToday}</span>}
        </div>

        <div className="form-group">
          <label>Submission Time <span className="req">*</span></label>
          <input type="time" {...field('submissionTime')} />
          {errors.submissionTime && <span className="error-msg">{errors.submissionTime}</span>}
        </div>
      </div>

      <div className="nav-row">
        <span />
        <button className="btn btn-primary" onClick={handleNext}>Next →</button>
      </div>
    </div>
  )
}
