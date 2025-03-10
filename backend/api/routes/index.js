import express from "express";

const router = express.Router();

// Example CRUD endpoints
router.get("/resources/:id", (req, res) => {
  res.json({ message: `Fetching resource with ID ${req.params.id}` });
});

router.put("/resources/:id", (req, res) => {
  res.json({ message: `Updating resource with ID ${req.params.id}` });
});

router.delete("/resources/:id", (req, res) => {
  res.json({ message: `Deleting resource with ID ${req.params.id}` });
});

export default router;