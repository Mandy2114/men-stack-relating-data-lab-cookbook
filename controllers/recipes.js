// controllers/recipes.js

const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');
const Ingredient = require("../models/ ingredient.js");

// router logic will go here - will be built later on in the lab
router.get("/", (req, res) => {
  res.render('recipes/index.ejs')
});

router.get("/new", async (req, res) => {
  const ingredients = await Ingredient.find({})
  res.render('recipes/new.ejs', {ingredients})
});

router.post("/", async (req, res) => {
  //const user = await User.findById(req.session.user._id)
  try {
    const recipeData = {
      ...req.body,
      owner: req.session.User._id,
    };

    const recipe = new Recipe.create(recipeData);
    res.send("Thanks for making a recipe")

    res.redirect("/recipes");
  } catch {
    console.log(error);
    res.redirect("/")
  }  
});

module.exports = router;
