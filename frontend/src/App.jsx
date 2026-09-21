import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'
import axios from 'axios'

// Admin pages
import LoginPage from './admin/LoginPage'
import Dashboard from './admin/Dashboard'
import ReportDetail from './admin/ReportDetail'
import RequireAuth from './admin/RequireAuth'

// Form components
import Stepper from './components/Stepper'
import Section0Identity from './components/Section0Identity'
import Section1Engagement from './components/Section1Engagement'
import Section2Reviews from './components/Section2Reviews'
import Section3Pipeline from './components/Section3Pipeline'
import Section4Leads from './components/Section4Leads'
import Section5AdminTasks from './components/Section5AdminTasks'
import Section6TeamCapacity from './components/Section6TeamCapacity'
import Section7Metrics from './components/Section7Metrics'
import Section8Blockers from './components/Section8Blockers'
import Section9Tomorrow from './components/Section9Tomorrow'
import Section10Observations from './components/Section10Observations'
import SuccessScreen from './components/SuccessScreen'

const STEPS = [
  'Identity', 'Engagement', 'Reviews', 'Pipeline', 'Leads',
  'Admin', 'Team', 'Metrics', 'Blockers', 'Tomorrow', 'Notes',
]

const EMPTY_FORM = {
  teamLeadName: '', reportingDate: new Date().toISOString().split('T')[0],
  vertical: '', activeClientPortfolio: '', availabilityToday: '',
  submissionTime: new Date().toTimeString().slice(0, 5),
  clientEngagements: [], chapterReviews: [], pipelineSnapshots: [],
  leads: [], adminTasks: [], teamCapacity: [],
  metrics: { sessionsHeld: 0, draftsReviewed: 0, feedbackSent: 0, newLeadsReceived: 0, clientsAtRisk: 0, totalActiveClients: 0 },
  blockers: 'No blockers or escalations today.',
  tomorrowPlan: [], observations: '',
}

function ReportForm() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [savedId, setSavedId] = useState(null)

  const update = (patch) => setForm((f) => ({ ...f, ...patch }))
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const prev = () => setStep((s) => Math.max(s - 1, 0))

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const payload = {
        ...form,
        activeClientPortfolio: Number(form.activeClientPortfolio) || 0,
        // Strip rows where the primary identifier is empty
        clientEngagements: form.clientEngagements.filter(r => r.clientId?.trim()),
        chapterReviews:    form.chapterReviews.filter(r => r.clientId?.trim()),
        pipelineSnapshots: form.pipelineSnapshots.filter(r => r.clientId?.trim()),
        leads:             form.leads.filter(r => r.leadName?.trim()),
        adminTasks:        form.adminTasks.filter(r => r.task?.trim()),
        teamCapacity:      form.teamCapacity.filter(r => r.coachName?.trim()),
        tomorrowPlan:      form.tomorrowPlan.filter(r => r.plannedTask?.trim()),
        metrics: {
          sessionsHeld:       Number(form.metrics.sessionsHeld) || 0,
          draftsReviewed:     Number(form.metrics.draftsReviewed) || 0,
          feedbackSent:       Number(form.metrics.feedbackSent) || 0,
          newLeadsReceived:   Number(form.metrics.newLeadsReceived) || 0,
          clientsAtRisk:      Number(form.metrics.clientsAtRisk) || 0,
          totalActiveClients: Number(form.metrics.totalActiveClients) || 0,
        },
      }
      const { data } = await axios.post('/api/reports', payload)
      setSavedId(data.data._id)
      setSubmitted(true)
      toast.success('Report submitted successfully!')
    } catch (err) {
      const msg = err.response?.data?.error || err.message
      toast.error('Submission failed: ' + msg)
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => { setForm(EMPTY_FORM); setStep(0); setSubmitted(false); setSavedId(null) }

  const progress = ((step + 1) / STEPS.length) * 100
  const sectionProps = { form, update, next, prev }

  const sections = [
    <Section0Identity {...sectionProps} />,
    <Section1Engagement {...sectionProps} />,
    <Section2Reviews {...sectionProps} />,
    <Section3Pipeline {...sectionProps} />,
    <Section4Leads {...sectionProps} />,
    <Section5AdminTasks {...sectionProps} />,
    <Section6TeamCapacity {...sectionProps} />,
    <Section7Metrics {...sectionProps} />,
    <Section8Blockers {...sectionProps} />,
    <Section9Tomorrow {...sectionProps} />,
    <Section10Observations form={form} update={update} prev={prev} onSubmit={handleSubmit} submitting={submitting} />,
  ]

  return (
    <>
      <header className="app-header">
        <div>
          <div className="logo">DBA <span>Coach</span></div>
          <div className="subtitle">Daily Status Report — Team Lead Submission</div>
        </div>
        <a href="/admin/login" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
          Admin →
        </a>
      </header>
      <main className="app-main">
        {submitted ? (
          <SuccessScreen id={savedId} onReset={handleReset} />
        ) : (
          <>
            <Stepper steps={STEPS} current={step} />
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            {sections[step]}
          </>
        )}
      </main>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public form */}
        <Route path="/" element={<ReportForm />} />

        {/* Admin login */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Protected admin routes */}
        <Route path="/admin/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/admin/reports/:id" element={<RequireAuth><ReportDetail /></RequireAuth>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
