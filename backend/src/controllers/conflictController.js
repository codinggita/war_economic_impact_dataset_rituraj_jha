const Conflict = require('../models/Conflict');

// Get all conflicts
exports.getConflicts = async (req, res) => {
  try {
    const conflicts = await Conflict.find();
    res.status(200).json(conflicts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single conflict
exports.getConflictById = async (req, res) => {
  try {
    const conflict = await Conflict.findById(req.params.id);
    if (!conflict) return res.status(404).json({ message: 'Conflict not found' });
    res.status(200).json(conflict);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new conflict
exports.createConflict = async (req, res) => {
  try {
    const conflict = new Conflict(req.body);
    const savedConflict = await conflict.save();
    res.status(201).json(savedConflict);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a conflict
exports.updateConflict = async (req, res) => {
  try {
    const conflict = await Conflict.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!conflict) return res.status(404).json({ message: 'Conflict not found' });
    res.status(200).json(conflict);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Partially update a conflict
exports.patchConflict = async (req, res) => {
  try {
    const conflict = await Conflict.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!conflict) return res.status(404).json({ message: 'Conflict not found' });
    res.status(200).json(conflict);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a conflict
exports.deleteConflict = async (req, res) => {
  try {
    const conflict = await Conflict.findByIdAndDelete(req.params.id);
    if (!conflict) return res.status(404).json({ message: 'Conflict not found' });
    res.status(200).json({ message: 'Conflict deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
