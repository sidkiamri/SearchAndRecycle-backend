import ImageModel from "../models/imageModel.mjs";

/*

// imageController.js

export const imageController = {
  uploadImage: async (req, res) => {
    try {
      const newImage = new ImageModel({
        filename: req.file.filename,
        path: req.file.path,
      });

      await newImage.save();

      res.status(201).json({ message: 'Image uploaded successfully!', newImage });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
*/