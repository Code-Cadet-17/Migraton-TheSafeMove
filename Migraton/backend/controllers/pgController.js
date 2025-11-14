const PG = require('../models/PG');

// ✅ Add new PG
exports.createPG = async (req, res) => {
  try {
    const newPG = new PG({
      ...req.body,
      owner: req.client._id,       // ✅ associate with logged-in client
      approved: false              // ✅ default not approved
    });

    await newPG.save();
    res.status(201).json({ message: 'PG added successfully', pg: newPG });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add PG', error: err.message });
  }
};

// ✅ Get all PGs
exports.getAllPGs = async (req, res) => {
  try {
    const pgs = await PG.find();
    res.status(200).json(pgs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch PGs', error: err.message });
  }
};

// ✅ Get PG by ID
exports.getPGById = async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg) return res.status(404).json({ message: 'PG not found' });
    res.status(200).json(pg);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching PG', error: err.message });
  }
};

// ✅ Update PG by ID
exports.updatePG = async (req, res) => {
  try {
    const updatedPG = await PG.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedPG) return res.status(404).json({ message: 'PG not found' });
    res.status(200).json({ message: 'PG updated', pg: updatedPG });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update PG', error: err.message });
  }
};

// ✅ Delete PG by ID
exports.deletePG = async (req, res) => {
  try {
    const deletedPG = await PG.findByIdAndDelete(req.params.id);
    if (!deletedPG) return res.status(404).json({ message: 'PG not found' });
    res.status(200).json({ message: 'PG deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete PG', error: err.message });
  }
};
