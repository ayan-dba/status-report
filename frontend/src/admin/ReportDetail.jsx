import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../api";

const STATUS_CLASS = {
  "On Track": "risk-on-track",
  "Caution": "risk-caution",
  "At Risk": "risk-at-risk",
  "Escalated": "risk-escalated",
};

function Section({ title, badge, children }) {
  return (
    <div className="card" style={{ marginBottom: 18 }}>
      <div className="card-title" style={{ marginBottom: 14 }}>
        {title}
        {badge && <span className="badge">{badge}</span>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: "0.88rem", color: "var(--text)" }}>{value}</div>
    </div>
  );
}

function Table({ headers, rows }) {
  if (!rows || rows.length === 0) {
    return <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>No entries recorded.</p>;
  }
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--border)", background: "var(--bg)" }}>
            {headers.map((h) => (
              <th key={h} style={{ padding: "9px 12px", textAlign: "left", fontWeight: 600, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "#fff" : "#fafbfc" }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: "9px 12px", verticalAlign: "top" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/reports/${id}`)
      .then(({ data }) => setReport(data.data))
      .catch(() => toast.error("Failed to load report."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ textAlign: "center", padding: 80, color: "var(--text-muted)" }}>Loading report…</div>
  );

  if (!report) return (
    <div style={{ textAlign: "center", padding: 80, color: "var(--danger)" }}>Report not found.</div>
  );

  const r = report;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <header className="app-header">
        <div>
          <div className="logo">DBA <span>Coach</span></div>
          <div className="subtitle">Report Detail View</div>
        </div>
        <button className="btn btn-secondary" style={{ padding: "7px 18px", fontSize: "0.82rem" }}
          onClick={() => navigate("/admin/dashboard")}>
          ← Back to Dashboard
        </button>
      </header>

      <main style={{ maxWidth: 960, margin: "28px auto", padding: "0 16px 60px" }}>

        {/* Report identity */}
        <Section title="Report Identity">
          <div className="form-grid cols-3">
            <Field label="Team Lead" value={r.teamLeadName} />
            <Field label="Reporting Date" value={r.reportingDate} />
            <Field label="Submission Time" value={r.submissionTime} />
            <Field label="Vertical / Specialisation" value={r.vertical} />
            <Field label="Active Client Portfolio" value={r.activeClientPortfolio} />
            <Field label="Availability Today" value={r.availabilityToday} />
          </div>
        </Section>

        {/* §1 Client Engagements */}
        <Section title="§1 — Client Engagement: Sessions & Interactions" badge="Required">
          <Table
            headers={["Client", "Stage", "Interaction Type", "Duration", "Discussion / Action", "Next Step"]}
            rows={(r.clientEngagements || []).map((e) => [
              e.clientId, e.dissertationStage, e.interactionType, e.duration, e.keyDiscussion, e.nextStep
            ])}
          />
        </Section>

        {/* §2 Chapter Reviews */}
        <Section title="§2 — Chapter & Deliverable Reviews" badge="Required">
          <Table
            headers={["Client", "Document / Chapter", "Version", "Review Type", "Feedback Sent?", "Key Issues"]}
            rows={(r.chapterReviews || []).map((e) => [
              e.clientId, e.documentChapter, e.version, e.reviewType,
              e.feedbackSent
                ? <span style={{ color: "var(--success)", fontWeight: 600 }}>✓ Sent</span>
                : <span style={{ color: "var(--warning)" }}>Pending</span>,
              e.keyIssuesFlagged || "—"
            ])}
          />
        </Section>

        {/* §3 Pipeline */}
        <Section title="§3 — Dissertation Pipeline Snapshot" badge="Core">
          <Table
            headers={["Client", "Current Chapter", "Supervisor Deadline", "Status", "Risk / Concern", "TL Action"]}
            rows={(r.pipelineSnapshots || []).map((e) => [
              e.clientId, e.currentChapter, e.supervisorDeadline,
              <span className={`risk-badge ${STATUS_CLASS[e.onTrack] || ""}`}>{e.onTrack}</span>,
              e.riskConcern || "—",
              e.tlActionNeeded || "—"
            ])}
          />
        </Section>

        {/* §4 Leads */}
        <Section title="§4 — New Leads & Enquiries" badge="Core">
          <Table
            headers={["Lead", "Source", "Programme / University", "Enquiry Type", "Action Taken", "Status"]}
            rows={(r.leads || []).map((e) => [
              e.leadName, e.source, e.programmeUniversity, e.enquiryType, e.actionTaken,
              <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "2px 8px", borderRadius: 12, background: "var(--bg)", border: "1px solid var(--border)" }}>{e.status}</span>
            ])}
          />
        </Section>

        {/* §5 Admin Tasks */}
        <Section title="§5 — Internal & Administrative Tasks" badge="Core">
          <Table
            headers={["Task", "Priority", "Status", "Notes"]}
            rows={(r.adminTasks || []).map((e) => {
              const pColor = { High: "#dc2626", Medium: "#d97706", Low: "#16a34a" }[e.priority] || "var(--text)";
              return [
                e.task,
                <span style={{ color: pColor, fontWeight: 700, fontSize: "0.78rem" }}>{e.priority}</span>,
                e.status,
                e.notes || "—"
              ];
            })}
          />
        </Section>

        {/* §6 Team Capacity */}
        <Section title="§6 — Team / Coach Capacity" badge="Core">
          <Table
            headers={["Coach / Member", "Available", "Active Clients", "Bandwidth", "Notes"]}
            rows={(r.teamCapacity || []).map((e) => {
              const bColor = { Low: "#16a34a", Moderate: "#d97706", "High Load": "#dc2626" }[e.bandwidth] || "var(--text)";
              return [
                e.coachName,
                e.availableToday
                  ? <span style={{ color: "var(--success)", fontWeight: 600 }}>✓ Yes</span>
                  : <span style={{ color: "var(--danger)", fontWeight: 600 }}>On Leave</span>,
                e.activeClients,
                <span style={{ color: bColor, fontWeight: 700, fontSize: "0.78rem" }}>{e.bandwidth}</span>,
                e.notes || "—"
              ];
            })}
          />
        </Section>

        {/* §7 Metrics */}
        <Section title="§7 — Daily Operational Metrics" badge="Core">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              ["Sessions Held", r.metrics?.sessionsHeld, "var(--primary)"],
              ["Drafts Reviewed", r.metrics?.draftsReviewed, "#7c3aed"],
              ["Feedback Sent", r.metrics?.feedbackSent, "var(--success)"],
              ["New Leads", r.metrics?.newLeadsReceived, "var(--accent)"],
              ["Clients at Risk", r.metrics?.clientsAtRisk, "var(--danger)"],
              ["Total Active Clients", r.metrics?.totalActiveClients, "var(--primary-light)"],
            ].map(([label, val, color]) => (
              <div key={label} style={{ background: color + "10", border: `1px solid ${color}25`, borderRadius: 8, padding: "12px 16px", textAlign: "center" }}>
                <div style={{ fontSize: "1.6rem", fontWeight: 700, color }}>{val ?? 0}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 3 }}>{label}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* §8 Blockers */}
        <Section title="§8 — Blockers & Escalations" badge="Required">
          <div style={{ background: r.blockers === "No blockers or escalations today." ? "#f0fdf4" : "#fff7ed",
            border: `1px solid ${r.blockers === "No blockers or escalations today." ? "#bbf7d0" : "#fed7aa"}`,
            borderRadius: 8, padding: "14px 16px", fontSize: "0.85rem",
            color: r.blockers === "No blockers or escalations today." ? "#166534" : "#92400e",
            whiteSpace: "pre-line" }}>
            {r.blockers || "No blockers or escalations today."}
          </div>
        </Section>

        {/* §9 Tomorrow's Plan */}
        <Section title="§9 — Plan for Tomorrow" badge="Core">
          <Table
            headers={["#", "Task / Session", "Client / Stakeholder", "Priority", "Time Slot"]}
            rows={(r.tomorrowPlan || []).map((e, i) => {
              const pColor = { High: "#dc2626", Medium: "#d97706", Low: "#16a34a" }[e.priority] || "var(--text)";
              return [
                i + 1,
                e.plannedTask,
                e.clientStakeholder,
                <span style={{ color: pColor, fontWeight: 700, fontSize: "0.78rem" }}>{e.priority}</span>,
                e.timeSlot || "—"
              ];
            })}
          />
        </Section>

        {/* §10 Observations */}
        {r.observations && (
          <Section title="§10 — Observations, Patterns & Suggestions" badge="Optional">
            <div style={{ background: "var(--bg)", borderRadius: 8, padding: "14px 16px", fontSize: "0.85rem", whiteSpace: "pre-line", color: "var(--text)" }}>
              {r.observations}
            </div>
          </Section>
        )}

        <div style={{ marginTop: 24, fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center" }}>
          Submitted: {new Date(r.createdAt).toLocaleString("en-GB")} · Report ID: {r._id}
        </div>
      </main>
    </div>
  );
}
