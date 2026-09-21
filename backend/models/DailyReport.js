const mongoose = require("mongoose");

// ── Sub-schemas ──────────────────────────────────────────────────────────────
// Note: sub-document fields use required: false so that partially-filled or
// empty rows don't block the parent document from saving. The frontend strips
// empty rows before submission as a first line of defence.

const ClientEngagementSchema = new mongoose.Schema({
  clientId:          { type: String, default: "" },
  dissertationStage: { type: String, default: "" },
  interactionType:   { type: String, default: "" },
  duration:          { type: String, default: "" },
  keyDiscussion:     { type: String, default: "" },
  nextStep:          { type: String, default: "" },
});

const ChapterReviewSchema = new mongoose.Schema({
  clientId:        { type: String, default: "" },
  documentChapter: { type: String, default: "" },
  version:         { type: String, default: "" },
  reviewType:      { type: String, default: "" },
  feedbackSent:    { type: Boolean, default: false },
  keyIssuesFlagged:{ type: String, default: "" },
});

const PipelineSnapshotSchema = new mongoose.Schema({
  clientId:           { type: String, default: "" },
  currentChapter:     { type: String, default: "" },
  supervisorDeadline: { type: String, default: "" },
  onTrack: {
    type: String,
    enum: ["On Track", "Caution", "At Risk", "Escalated", ""],
    default: "On Track",
  },
  riskConcern:    { type: String, default: "" },
  tlActionNeeded: { type: String, default: "" },
});

const LeadSchema = new mongoose.Schema({
  leadName:            { type: String, default: "" },
  source:              { type: String, default: "" },
  programmeUniversity: { type: String, default: "" },
  enquiryType:         { type: String, default: "" },
  actionTaken:         { type: String, default: "" },
  status: {
    type: String,
    enum: ["Call Scheduled", "Awaiting Reply", "Proposal Sent", "Onboarded", "Declined", ""],
    default: "Awaiting Reply",
  },
});

const AdminTaskSchema = new mongoose.Schema({
  task:     { type: String, default: "" },
  priority: { type: String, enum: ["High", "Medium", "Low", ""], default: "Medium" },
  status:   { type: String, enum: ["Done", "In Progress", "Scheduled", "Pending", ""], default: "In Progress" },
  notes:    { type: String, default: "" },
});

const TeamCapacitySchema = new mongoose.Schema({
  coachName:      { type: String, default: "" },
  availableToday: { type: Boolean, default: true },
  activeClients:  { type: Number, default: 0 },
  bandwidth:      { type: String, enum: ["Low", "Moderate", "High Load", ""], default: "Moderate" },
  notes:          { type: String, default: "" },
});

const TomorrowPlanSchema = new mongoose.Schema({
  plannedTask:        { type: String, default: "" },
  clientStakeholder:  { type: String, default: "" },
  priority:           { type: String, enum: ["High", "Medium", "Low", ""], default: "High" },
  timeSlot:           { type: String, default: "" },
});

// ── Main Report Schema ────────────────────────────────────────────────────────

const DailyReportSchema = new mongoose.Schema(
  {
    // Section 0 — Report Identity
    teamLeadName:          { type: String, required: true },
    reportingDate:         { type: String, required: true },
    vertical:              { type: String, required: true },
    activeClientPortfolio: { type: Number, required: true },
    availabilityToday:     { type: String, required: true },
    submissionTime:        { type: String, required: true },

    // Section 1 — Client Engagement
    clientEngagements: [ClientEngagementSchema],

    // Section 2 — Chapter Reviews
    chapterReviews: [ChapterReviewSchema],

    // Section 3 — Pipeline Snapshot
    pipelineSnapshots: [PipelineSnapshotSchema],

    // Section 4 — Leads & Onboarding
    leads: [LeadSchema],

    // Section 5 — Admin Tasks
    adminTasks: [AdminTaskSchema],

    // Section 6 — Team Capacity
    teamCapacity: [TeamCapacitySchema],

    // Section 7 — Daily Metrics
    metrics: {
      sessionsHeld:      { type: Number, default: 0 },
      draftsReviewed:    { type: Number, default: 0 },
      feedbackSent:      { type: Number, default: 0 },
      newLeadsReceived:  { type: Number, default: 0 },
      clientsAtRisk:     { type: Number, default: 0 },
      totalActiveClients:{ type: Number, default: 0 },
    },

    // Section 8 — Blockers & Escalations
    blockers: { type: String, default: "No blockers or escalations today." },

    // Section 9 — Tomorrow's Plan
    tomorrowPlan: [TomorrowPlanSchema],

    // Section 10 — Observations & Suggestions
    observations: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DailyReport", DailyReportSchema);
