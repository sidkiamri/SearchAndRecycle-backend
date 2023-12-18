import express from "express";

import { 
  getRecyclingWastes, 
  createRecyclableWasteWithAcceptedMaterials, 
  updateRecyclingWaste, 
  deleteRecyclingWaste,
  getRecyclingWastesByMaterial,
  updateRecyclingWastePoints,
  deleteRecyclingWasteById,
  getRecyclableWastes,
  deleteAllRecyclingWastes
} from '../controller/RecycleWasteController.mjs';

const router = express.Router();

// Get all recycling wastes
router.get('/', getRecyclingWastes);

// Create a new recycling waste
router.post('/', createRecyclableWasteWithAcceptedMaterials);

// Update an existing recycling waste
router.patch('/:id', updateRecyclingWaste);

// Delete a recycling waste
router.delete('/:id', deleteRecyclingWaste);

// Get recycling wastes by material
router.get('/material/:wasteType', getRecyclingWastesByMaterial);

// Update recycling waste points
router.patch('/:id/points', updateRecyclingWastePoints);

// Delete a recycling waste by ID
router.delete('/:id', deleteRecyclingWasteById);

// Get all recyclable wastes
router.get('/recyclable', getRecyclableWastes);
router.delete('/recycling-wastes', deleteAllRecyclingWastes);

export default router;
