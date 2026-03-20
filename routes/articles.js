    const express = require("express");
const router = express.Router();

const Article = require("../models/Article");

router.post("/", async (req, res) => {
  const article = new Article(req.body);
  await article.save();
  res.json(article);
});

router.get("/", async (req, res) => {
  const data = await Article.find().sort({ createdAt: -1 });
  res.json(data);
});

// ❤️ LIKE
router.post("/like/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  article.likes += 1;
  await article.save();
  res.json({ likes: article.likes });
});

module.exports = router;