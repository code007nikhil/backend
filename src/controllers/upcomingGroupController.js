import UpcomingGroup from "../models/UpcomingGroup.js";

// ─── Get all upcoming groups ──────────────────────────────────────────────────
export const getAllGroups = async (req, res) => {
  try {
    const { company, status, sortBy = "rontiGadhDate", sortOrder = "asc" } = req.query;

    // Build filter object
    const filter = {};
    if (company) filter.company = company;
    if (status) filter.status = status;

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === "asc" ? 1 : -1;

    const groups = await UpcomingGroup.find(filter).sort(sortObj).lean();

    res.status(200).json({
      success: true,
      count: groups.length,
      data: groups,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── Get single group ────────────────────────────────────────────────────────
export const getGroup = async (req, res) => {
  try {
    const group = await UpcomingGroup.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.status(200).json({
      success: true,
      data: group,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── Create new group ────────────────────────────────────────────────────────
export const createGroup = async (req, res) => {
  try {
    const { company, trekkers, jiskunDate, rontiGadhDate, status } = req.body;

    // Validate required fields
    if (!company || trekkers === undefined || !jiskunDate || !rontiGadhDate) {
      return res.status(400).json({
        error: "Missing required fields: company, trekkers, jiskunDate, rontiGadhDate",
      });
    }

    const newGroup = new UpcomingGroup({
      company,
      trekkers: trekkers,
      jiskunDate,
      rontiGadhDate,
      status: status || "Not Arrived",
    });

    await newGroup.save();

    res.status(201).json({
      success: true,
      message: "Group created successfully",
      data: newGroup,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── Update group ───────────────────────────────────────────────────────────
export const updateGroup = async (req, res) => {
  try {
    const { company, trekkers, jiskunDate, rontiGadhDate, status } = req.body;

    const updateData = {};
    if (company !== undefined) updateData.company = company;
    if (trekkers !== undefined) updateData.trekkers = trekkers;
    if (jiskunDate !== undefined) updateData.jiskunDate = jiskunDate;
    if (rontiGadhDate !== undefined) updateData.rontiGadhDate = rontiGadhDate;
    if (status !== undefined) updateData.status = status;

    const group = await UpcomingGroup.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.status(200).json({
      success: true,
      message: "Group updated successfully",
      data: group,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── Delete group ───────────────────────────────────────────────────────────
export const deleteGroup = async (req, res) => {
  try {
    const group = await UpcomingGroup.findByIdAndDelete(req.params.id);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.status(200).json({
      success: true,
      message: "Group deleted successfully",
      data: group,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── Get unique companies ────────────────────────────────────────────────────
export const getCompanies = async (req, res) => {
  try {
    const companies = await UpcomingGroup.distinct("company");
    res.status(200).json({
      success: true,
      data: companies.sort(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
