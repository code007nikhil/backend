import Campsite from "../models/Campsite.js";

// ─── Get all campsites (with optional filters) ──────────────────────────────────
export const getAllCampsites = async (req, res) => {
  try {
    const { company, fromDate, toDate, sortBy = "date", sortOrder = "asc" } = req.query;

    // Build filter object
    const filter = {};
    if (company) filter.company = company;
    if (fromDate || toDate) {
      filter.date = {};
      if (fromDate) filter.date.$gte = fromDate;
      if (toDate) filter.date.$lte = toDate;
    }

    // Build sort object
    const sortObj = {};
    if (sortBy === "bill") {
      // Note: MongoDB doesn't support sorting by computed fields directly
      // We'll sort by date by default and let frontend handle bill sorting
      sortObj.date = sortOrder === "asc" ? 1 : -1;
    } else {
      sortObj[sortBy] = sortOrder === "asc" ? 1 : -1;
    }

    const campsites = await Campsite.find(filter).sort(sortObj).lean();

    // Add computed fields
    const campsitesWithBill = campsites.map(camp => {
      const totalBill = camp.clients * camp.rtrekker +
        1 * camp.rleader +
        camp.gcount * camp.rguide +
        camp.porters * camp.rporter +
        camp.staff * camp.rstaff;
      return {
        ...camp,
        totalBill,
        totalPeople: camp.clients + 1 + camp.gcount + camp.porters + camp.staff,
        remainingBalance: totalBill - (camp.paidAmount || 0),
      };
    });

    res.status(200).json({
      success: true,
      count: campsitesWithBill.length,
      data: campsitesWithBill,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── Get unique companies ──────────────────────────────────────────────────────
export const getCompanies = async (req, res) => {
  try {
    const companies = await Campsite.distinct("company");
    res.status(200).json({
      success: true,
      data: companies.sort(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── Get single campsite ───────────────────────────────────────────────────────
export const getCampsite = async (req, res) => {
  try {
    const campsite = await Campsite.findById(req.params.id);
    if (!campsite) {
      return res.status(404).json({ error: "Campsite not found" });
    }

    const totalBill = campsite.calculateBill();
    const totalPeople = campsite.getTotalPeople();
    const remainingBalance = campsite.calculateBalance();

    res.status(200).json({
      success: true,
      data: { ...campsite.toObject(), totalBill, totalPeople, remainingBalance },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── Create campsite ───────────────────────────────────────────────────────────
export const createCampsite = async (req, res) => {
  try {
    const {
      date,
      company,
      leader,
      guides,
      clients,
      gcount,
      porters,
      staff,
      staffrole,
      rtrekker,
      rleader,
      rguide,
      rporter,
      rstaff,
      paidStatus,
      notes,
      paidAmount,
    } = req.body;

    // Validate required fields
    if (!date || !company || !leader) {
      return res.status(400).json({ error: "Missing required fields: date, company, leader" });
    }

    const newCampsite = new Campsite({
      date,
      company,
      leader,
      guides: guides || "",
      clients: clients || 0,
      gcount: gcount || 0,
      porters: porters || 0,
      staff: staff || 0,
      staffrole: staffrole || "",
      rtrekker: rtrekker || 0,
      rleader: rleader || 0,
      rguide: rguide || 0,
      rporter: rporter || 0,
      rstaff: rstaff || 0,
      paidStatus: paidStatus || "not paid",
      notes: notes || "",
      paidAmount: paidAmount || 0,
    });

    await newCampsite.save();

    const totalBill = newCampsite.calculateBill();
    const totalPeople = newCampsite.getTotalPeople();
    const remainingBalance = newCampsite.calculateBalance();

    res.status(201).json({
      success: true,
      message: "Campsite created successfully",
      data: { ...newCampsite.toObject(), totalBill, totalPeople, remainingBalance },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── Update campsite ───────────────────────────────────────────────────────────
export const updateCampsite = async (req, res) => {
  try {
    const {
      date,
      company,
      leader,
      guides,
      clients,
      gcount,
      porters,
      staff,
      staffrole,
      rtrekker,
      rleader,
      rguide,
      rporter,
      rstaff,
      paidStatus,
      notes,
      paidAmount,
    } = req.body;

    const updateData = {};
    if (date !== undefined) updateData.date = date;
    if (company !== undefined) updateData.company = company;
    if (leader !== undefined) updateData.leader = leader;
    if (guides !== undefined) updateData.guides = guides;
    if (clients !== undefined) updateData.clients = clients;
    if (gcount !== undefined) updateData.gcount = gcount;
    if (porters !== undefined) updateData.porters = porters;
    if (staff !== undefined) updateData.staff = staff;
    if (staffrole !== undefined) updateData.staffrole = staffrole;
    if (rtrekker !== undefined) updateData.rtrekker = rtrekker;
    if (rleader !== undefined) updateData.rleader = rleader;
    if (rguide !== undefined) updateData.rguide = rguide;
    if (rporter !== undefined) updateData.rporter = rporter;
    if (rstaff !== undefined) updateData.rstaff = rstaff;
    if (paidStatus !== undefined) updateData.paidStatus = paidStatus;
    if (notes !== undefined) updateData.notes = notes;
    if (paidAmount !== undefined) updateData.paidAmount = paidAmount;

    const campsite = await Campsite.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!campsite) {
      return res.status(404).json({ error: "Campsite not found" });
    }

    const totalBill = campsite.calculateBill();
    const totalPeople = campsite.getTotalPeople();
    const remainingBalance = campsite.calculateBalance();

    res.status(200).json({
      success: true,
      message: "Campsite updated successfully",
      data: { ...campsite.toObject(), totalBill, totalPeople, remainingBalance },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── Delete campsite ───────────────────────────────────────────────────────────
export const deleteCampsite = async (req, res) => {
  try {
    const campsite = await Campsite.findByIdAndDelete(req.params.id);

    if (!campsite) {
      return res.status(404).json({ error: "Campsite not found" });
    }

    res.status(200).json({
      success: true,
      message: "Campsite deleted successfully",
      data: campsite,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── Get stats ──────────────────────────────────────────────────────────────────
export const getStats = async (req, res) => {
  try {
    const { company, fromDate, toDate } = req.query;

    // Build filter object
    const filter = {};
    if (company) filter.company = company;
    if (fromDate || toDate) {
      filter.date = {};
      if (fromDate) filter.date.$gte = fromDate;
      if (toDate) filter.date.$lte = toDate;
    }

    const campsites = await Campsite.find(filter).lean();

    const stats = {
      totalCampsites: campsites.length,
      totalTrekkers: campsites.reduce((sum, c) => sum + c.clients, 0),
      totalPeople: campsites.reduce(
        (sum, c) => sum + c.clients + 1 + c.gcount + c.porters + c.staff,
        0
      ),
      totalRevenue: campsites.reduce(
        (sum, c) =>
          sum +
          (c.clients * c.rtrekker +
            1 * c.rleader +
            c.gcount * c.rguide +
            c.porters * c.rporter +
            c.staff * c.rstaff),
        0
      ),
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
