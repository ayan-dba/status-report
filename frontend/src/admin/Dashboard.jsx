import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../api";

const STATUS_CLASS = {
  "On Track": "risk-on-track",
  "Caution": "risk-caution",
  "At Risk": "risk-at-risk",
  "Escalated": "risk-escalated",
};

function MetricPill({ label, value, color }) {
  return (
    <div style={{
      background: color + "12", border: `1px solid ${color}30`,
      borderRadius: 8, padding: "10px 14px", textAlign: "center", minWidth: 90
    }}>
      <div style={{ fontSize: "1.3rem", fontWeight: 700, color }}>{value ?? "—"}</div>
      <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("dba_admin") || "{}");

  const [reports, setReports] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const limit = 10;

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (search) params.teamLead = search;
      if (dateFilter) params.date = dateFilter;
      const { data } = await api.get("/reports", { params });
      setReports(data.data);
      setTotal(data.total);
    } catch (err) {
      toast.error("Failed to load reports.");
    } finally {
      setLoading(false);
    }
  }, [page, search, dateFilter]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleLogout = () => {
    localStorage.removeItem("dba_token");
    localStorage.removeItem("dba_admin");
    navigate("/admin/login");
  };

  const totalPages = Math.ceil(total / limit);

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  // Aggregate risk counts from current page
  const atRiskCount = reports.filter(r =>
    ["At Risk", "Escalated"].includes(r.metrics?.clientsAtRisk > 0 ? "At Risk" : "")
  ).length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <header className="app-header" style={{ justifyContent: "space-between" }}>
        <div>
          <div className="logo">DBA <span>Coach</span> <span style={{ fontSize: "0.75rem", opacity: 0.7, fontWeight: 400 }}>Admin Portal</span></div>
          <div className="subtitle">Daily Status Reports Dashboard</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>👤 {admin.name || "Admin"}</span>
          <button className="btn btn-secondary" style={{ padding: "6px 16px", fontSize: "0.8rem" }} onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "28px auto", padding: "0 16px 60px" }}>

        {/* Summary bar */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
          <MetricPill label="Total Reports" value={total} color="var(--primary)" />
          <MetricPill label="Showing" value={reports.length} color="#6b7a99" />
        </div>

        {/* Filters */}
        <div className="card" style={{ padding: "16px 20px", marginBottom: 20 }}>
          <form onSubmit={handleSearch} style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div className="form-group" style={{ flex: "1 1 200px", marginBottom: 0 }}>
              <label>Search by Team Lead</label>
              <input type="text" placeholder="e.g. John Smith"
                value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
            </div>
            <div className="form-group" style={{ flex: "1 1 160px", marginBottom: 0 }}>
              <label>Filter by Date</label>
              <input type="date" value={dateFilter}
                onChange={(e) => { setDateFilter(e.target.value); setPage(1); }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-end", padding: "9px 20px" }}>
              Search
            </button>
            {(search || dateFilter) && (
              <button type="button" className="btn btn-secondary"
                style={{ alignSelf: "flex-end", padding: "9px 16px" }}
                onClick={() => { setSearch(""); setSearchInput(""); setDateFilter(""); setPage(1); }}>
                Clear
              </button>
            )}
          </form>
        </div>

        {/* Table */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading reports…</div>
          ) : reports.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
              No reports found.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
                <thead>
                  <tr style={{ background: "var(--bg)", borderBottom: "2px solid var(--border)" }}>
                    {["Date", "Team Lead", "Vertical", "Availability", "Clients", "Sessions", "Drafts", "Leads", "At Risk", ""].map((h) => (
                      <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 600, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r, i) => (
                    <tr key={r._id}
                      style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "#fff" : "#fafbfc" }}
                    >
                      <td style={{ padding: "11px 14px", whiteSpace: "nowrap" }}>{r.reportingDate ? r.reportingDate : formatDate(r.createdAt)}</td>
                      <td style={{ padding: "11px 14px", fontWeight: 600, color: "var(--primary)" }}>{r.teamLeadName}</td>
                      <td style={{ padding: "11px 14px", color: "var(--text-muted)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.vertical}</td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ fontSize: "0.75rem", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, padding: "2px 8px" }}>
                          {r.availabilityToday || "—"}
                        </span>
                      </td>
                      <td style={{ padding: "11px 14px", textAlign: "center" }}>{r.activeClientPortfolio ?? "—"}</td>
                      <td style={{ padding: "11px 14px", textAlign: "center" }}>{r.metrics?.sessionsHeld ?? "—"}</td>
                      <td style={{ padding: "11px 14px", textAlign: "center" }}>{r.metrics?.draftsReviewed ?? "—"}</td>
                      <td style={{ padding: "11px 14px", textAlign: "center" }}>{r.metrics?.newLeadsReceived ?? "—"}</td>
                      <td style={{ padding: "11px 14px", textAlign: "center" }}>
                        {r.metrics?.clientsAtRisk > 0 ? (
                          <span className="risk-badge risk-at-risk">{r.metrics.clientsAtRisk}</span>
                        ) : (
                          <span style={{ color: "var(--success)", fontWeight: 600 }}>0</span>
                        )}
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: "5px 14px", fontSize: "0.78rem" }}
                          onClick={() => navigate(`/admin/reports/${r._id}`)}
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20, alignItems: "center" }}>
            <button className="btn btn-secondary" style={{ padding: "6px 16px" }}
              disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
            <span style={{ fontSize: "0.83rem", color: "var(--text-muted)" }}>
              Page {page} of {totalPages}
            </span>
            <button className="btn btn-secondary" style={{ padding: "6px 16px" }}
              disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
          </div>
        )}
      </main>
    </div>
  );
}
