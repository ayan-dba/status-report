export default function Stepper({ steps, current }) {
  return (
    <div className="stepper">
      {steps.map((label, i) => (
        <div key={i} className="step-item" style={{ display: 'flex', alignItems: 'center' }}>
          <div className="step-wrap">
            <div className={`step-circle ${i === current ? 'active' : i < current ? 'done' : ''}`}>
              {i < current ? '✓' : i + 1}
            </div>
            <div className={`step-label ${i === current ? 'active' : i < current ? 'done' : ''}`}>
              {label}
            </div>
          </div>
          {i < steps.length - 1 && (
            <div className={`step-connector ${i < current ? 'done' : ''}`} />
          )}
        </div>
      ))}
    </div>
  )
}
