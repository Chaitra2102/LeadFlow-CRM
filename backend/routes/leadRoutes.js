const express = require("express");
const Lead = require("../models/Lead");

const router = express.Router();

// Create new lead
router.post("/", async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all leads
router.get("/", async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search leads
router.get("/search/:keyword", async (req, res) => {
  try {
    const leads = await Lead.find({
      $or: [
        { name: { $regex: req.params.keyword, $options: "i" } },
        { email: { $regex: req.params.keyword, $options: "i" } },
        { source: { $regex: req.params.keyword, $options: "i" } },
        { status: { $regex: req.params.keyword, $options: "i" } },
      ],
    });

    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update lead status
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add follow-up note
router.post("/:id/notes", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    lead.notes.push({
      text: req.body.text,
      createdAt: new Date(),
    });

    await lead.save();

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a specific note
router.put("/:leadId/notes/:noteId", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.leadId);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const note = lead.notes.id(req.params.noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.text = req.body.text;
    note.createdAt = new Date();

    await lead.save();

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete lead
router.delete("/:id", async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;