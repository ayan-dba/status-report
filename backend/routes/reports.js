const express = require("express");
const router = express.Router();
const DailyReport = require("../models/DailyReport");
const { protect } = require("../middleware/auth");

// POST /api/reports — Submit a new daily report (public — used by the form)
router.post("/", async (req, res) => {
  try {
    const report = new DailyReport(req.body);
    const saved = await report.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error("Error saving report:", err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /api/reports — List all reports (admin only)
router.get("/", protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, teamLead, date } = req.query;
    const filter = {};
    if (teamLead) filter.teamLeadName = new RegExp(teamLead, "i");
    if (date) filter.reportingDate = date;

    const reports = await DailyReport.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select(
        "teamLeadName reportingDate vertical activeClientPortfolio availabilityToday metrics submissionTime createdAt"
      );

    const total = await DailyReport.countDocuments(filter);

    res.json({ success: true, data: reports, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/reports/:id — Get a single full report (admin only)
router.get("/:id", protect, async (req, res) => {
  try {
    const report = await DailyReport.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, error: "Report not found" });
    res.json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/reports/:id — Update a report (admin only)
router.put("/:id", protect, async (req, res) => {
  try {
    const report = await DailyReport.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!report) return res.status(404).json({ success: false, error: "Report not found" });
    res.json({ success: true, data: report });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /api/reports/:id — Delete a report (admin only)
router.delete("/:id", protect, async (req, res) => {
  try {
    const report = await DailyReport.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ success: false, error: "Report not found" });
    res.json({ success: true, message: "Report deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
