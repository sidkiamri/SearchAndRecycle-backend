import Can from "../models/can.mjs";
import WasteType from "../models/WasteType.mjs";

// Function to GET all cans
export async function getAllCans(req, res) {
  try {
    const cans = await Can.find();
    res.json(cans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Function to GET a single can by id
export async function getCanById(req, res) {
  try {
    const can = await Can.findById(req.params.id);
    if (can == null) {
      return res.status(404).json({ message: 'Cannot find can' });
    }
    res.json(can);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Function to CREATE a new can
export async function createCan(req, res) {
  const can = new Can({
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    tid: req.body.tid,
    typeWasteSeparated: req.body.typeWasteSeparated,
    commodityWasteSeparated: req.body.commodityWasteSeparated,
    owner: req.body.owner,
    name: req.body.name,
    street: req.body.street,
    cp: req.body.cp,
    isPublic: req.body.isPublic
  });

  try {
    const newCan = await can.save();
    res.status(201).json(newCan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Function to UPDATE an existing can
export async function updateCanById(req, res) {
  try {
    const can = await Can.findById(req.params.id);
    if (can == null) {
      return res.status(404).json({ message: 'Cannot find can' });
    }

    if (req.body.latitude != null) {
      can.latitude = req.body.latitude;
    }
    if (req.body.longitude != null) {
      can.longitude = req.body.longitude;
    }
    if (req.body.tid != null) {
      can.tid = req.body.tid;
    }
    if (req.body.typeWasteSeparated != null) {
      can.typeWasteSeparated = req.body.typeWasteSeparated;
    }
    if (req.body.commodityWasteSeparated != null) {
      can.commodityWasteSeparated = req.body.commodityWasteSeparated;
    }
    if (req.body.owner != null) {
      can.owner = req.body.owner;
    }
    if (req.body.name != null) {
      can.name = req.body.name;
    }
    if (req.body.street != null) {
      can.street = req.body.street;
    }
    if (req.body.cp != null) {
      can.cp = req.body.cp;
    }
    if (req.body.isPublic != null) {
      can.isPublic = req.body.isPublic;
    }

    const updatedCan = await can.save();
    res.json(updatedCan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Function to DELETE a can
export async function deleteCanById(req, res) {
  try {
    const can = await Can.findById(req.params.id);
    if (can == null) {
      return res.status(404).json({ message: 'Cannot find can' });
    }

    await can.remove();
    res.json({ message: 'Can deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


export const getCansByWasteType = async (req, res) => {
    try {
        // Find the waste type
        const wasteType = await WasteType.findOne({ _id: req.params.description });
    
        if (!wasteType) {
          return res.status(404).json({ message: 'Waste type not found' });
        }
    
        // Find the cans with the matching waste type
        const cans = await Can.find({ typeWasteSeparated: wasteType.id });
    
        res.status(200).json(cans);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
};


