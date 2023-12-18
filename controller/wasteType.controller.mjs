import WasteType from "../models/WasteType.mjs";

// Get all waste types
export const getWasteTypes = async (req, res) => {
  try {
    const wasteTypes = await WasteType.find();
    res.status(200).json(wasteTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new waste type
export const createWasteType = async (req, res) => {
  const wasteType = new WasteType({
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    decompositionTime: req.body.decompositionTime,
    kills: req.body.kills,
    cans: req.body.cans
  });

  try {
    const newWasteType = await wasteType.save();
    res.status(201).json(newWasteType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing waste type
export const updateWasteType = async (req, res) => {
  const { id } = req.params;

  try {
    const existingWasteType = await WasteType.findById(id);

    if (!existingWasteType) {
      return res.status(404).json({ message: 'Waste type not found' });
    }

    existingWasteType.description = req.body.description;
    existingWasteType.imageUrl = req.body.imageUrl;
    existingWasteType.decompositionTime = req.body.decompositionTime;
    existingWasteType.kills = req.body.kills;
    existingWasteType.cans = req.body.cans;

    const updatedWasteType = await existingWasteType.save();
    res.json(updatedWasteType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a waste type
export const deleteWasteType = async (req, res) => {
  const { id } = req.params;

  try {
    const existingWasteType = await WasteType.findById(id);

    if (!existingWasteType) {
      return res.status(404).json({ message: 'Waste type not found' });
    }

    await existingWasteType.remove();
    res.json({ message: 'Waste type deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

