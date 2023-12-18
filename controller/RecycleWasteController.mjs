import RecyclingWaste from "../models/recyclingWaste.mjs";
import WasteType from "../models/WasteType.mjs";

// Get all recycling wastes
export const getRecyclingWastes = async (req, res) => {
  try {
    const recyclingWastes = await RecyclingWaste.find();
    res.status(200).json(recyclingWastes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new recycling waste
export const createRecyclableWasteWithAcceptedMaterials = async (req, res) => {
  const { name, imageUrl, acceptedMaterials,userId } = req.body;


  const recyclingWaste = new RecyclingWaste({ name, imageUrl, acceptedMaterials,userId });

  try {
   
    await recyclingWaste.save();
    res.status(201).json(recyclingWaste);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Update an existing recycling waste
export const updateRecyclingWaste = async (req, res) => {
  const { id } = req.params;

  try {
    const existingRecyclingWaste = await RecyclingWaste.findById(id);

    if (!existingRecyclingWaste) {
      return res.status(404).json({ message: 'Recycling waste not found' });
    }

    existingRecyclingWaste.name = req.body.name;
    existingRecyclingWaste.description = req.body.description;
    existingRecyclingWaste.points = req.body.points;
    existingRecyclingWaste.imageUrl = req.body.imageUrl;
    existingRecyclingWaste.acceptedMaterials = req.body.acceptedMaterials;
    existingRecyclingWaste.recycleMethod = req.body.recycleMethod;
    existingRecyclingWaste.recyclable = req.body.recyclable;
    existingRecyclingWaste.updatedAt = Date.now();

    const updatedRecyclingWaste = await existingRecyclingWaste.save();
    res.json(updatedRecyclingWaste);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a recycling waste
export const deleteRecyclingWaste = async (req, res) => {
  const { id } = req.params;

  try {
    const existingRecyclingWaste = await RecyclingWaste.findById(id);

    if (!existingRecyclingWaste) {
      return res.status(404).json({ message: 'Recycling waste not found' });
    }

    await existingRecyclingWaste.remove();
    res.json({ message: 'Recycling waste deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getRecyclingWastesByMaterial = async (req, res) => {
    const { wasteType } = req.params;
  
    try {
      const recyclingWastes = await RecyclingWaste.find({ acceptedMaterials: wasteType });
  
      if (recyclingWastes.length === 0) {
        return res.status(404).json({ message: 'No recycling wastes found for the specified material' });
      }
  
      res.status(200).json(recyclingWastes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  export const updateRecyclingWastePoints = async (req, res) => {
    const { id } = req.params;
    const { points } = req.body;
  
    try {
      const existingRecyclingWaste = await RecyclingWaste.findById(id);
  
      if (!existingRecyclingWaste) {
        return res.status(404).json({ message: 'Recycling waste not found' });
      }
  
      existingRecyclingWaste.points = points;
      const updatedRecyclingWaste = await existingRecyclingWaste.save();
  
      res.status(200).json(updatedRecyclingWaste);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  export const deleteRecyclingWasteById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const existingRecyclingWaste = await RecyclingWaste.findById(id);
  
      if (!existingRecyclingWaste) {
        return res.status(404).json({ message: 'Recycling waste not found' });
      }
  
      await existingRecyclingWaste.remove();
      res.json({ message: 'Recycling waste deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  export const getRecyclableWastes = async (req, res) => {
    try {
      const recyclingWastes = await RecyclingWaste.find({ recyclable: true }).populate('acceptedMaterials');
      res.status(200).json(recyclingWastes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  export const deleteAllRecyclingWastes = async (req, res) => {
    try {
      await RecyclingWaste.deleteMany({});
      
      res.status(200).json({ message: 'All recycling wastes deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  