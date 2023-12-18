import express from "express";
import { createWasteType, deleteWasteType, getWasteTypes, updateWasteType } from "../controller/wasteType.controller.mjs";

const router = express.Router();

  // Get all waste types
  router.get('/', getWasteTypes);

  // Create a new waste type
  router.post('/', createWasteType);

  // Update an existing waste type
  router.put('/:id', updateWasteType);

  // Delete a waste type
  router.delete('/:id', deleteWasteType);

  export default router;

