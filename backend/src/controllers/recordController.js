const models = require('../models/RecordModels');

exports.createRecord = (modelName) => async (req, res) => {
  try {
    const Model = models[modelName];
    const record = new Model(req.body);
    const savedRecord = await record.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateRecord = (modelName) => async (req, res) => {
  try {
    const Model = models[modelName];
    // using the id parameter which could be named anything (recordId, countryId, etc)
    const id = Object.values(req.params)[0];
    const record = await Model.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.status(200).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteRecord = (modelName) => async (req, res) => {
  try {
    const Model = models[modelName];
    const id = Object.values(req.params)[0];
    const record = await Model.findByIdAndDelete(id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
