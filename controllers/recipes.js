// controllers/recipes.js

const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');
const Ingredient = require("../models/ ingredient.js");

// router logic will go here - will be built later on in the lab

router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find({ owner: req.session.user._id });
    res.render("recipes/index.ejs", { recipes });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
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

    const recipe = new Recipe(recipeData);
    await recipe.save();

    res.redirect("/recipes");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }  
});

router.get("/:recipeId", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);

    if (recipe.owner.toString() == req.session.user._id) {
      res.render("recipes/show.ejs", { recipe });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.delete("/:recipeId", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);

    if (recipe.owner.toString() == req.session.user._id) {
      await Recipe.findByIdAndDelete(req.params.recipeId);
      res.redirect()
    } else {
      
    }
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});
module.exports = router;
