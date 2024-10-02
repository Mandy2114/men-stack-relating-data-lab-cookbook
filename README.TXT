(1)As a User (AAU), I want to sign up for an account and sign in, 
so that I can access my personal user profile and manage my recipes.

(2)AAU, I want an easy and consistent way to navigate through the site, whether I am signed in or not.
I need to quickly access options to sign up, sign in, view my recipes, or sign out, depending on my current status.

(3)AAU, I need a dedicated page to view all my recipes, to easily manage and review what I have created.

(4)AAU, I want to see the full details of each recipe I create.

(5)AAU, I want to easily find and click on an ‘Add New Recipe’ link, 
which takes me to a form for adding new recipes to my collection.

(6)AAU, after filling out the recipe form, 
I want to submit it and receive confirmation that the recipe has been saved.

(7)AAU, I need the ability to edit and delete recipes in my collection, 
allowing me full control over managing my data.

(8)AAU, I want to be able to add new ingredients to my recipe manager. 
This way, I can keep track of the different ingredients I use across various recipes.

(9)AAU, when adding a new recipe, I want an option to quickly add ingredients that are not already in my list. 
This will streamline the process of recipe creation, 
ensuring I can include all necessary ingredients without navigating away from the recipe form.

(10)AAU, I am interested in viewing a list of all other app users, to foster a sense of community within the app.

(11)AAU, I want the option to click on another user’s profile and view all the recipes they have created, 
to exchange ideas or find inspiration for my own collection.

controllers/recipes.js
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
      res.redirect("/recipes");
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.get("/:recipeId/edit", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    // res.render("recipes/edit.ejs", { recipe });
    if (recipe.owner.toString() == req.session.user._id) {
      res.render("recipes/edit.ejs", { recipe });
    } else {
      res.redirect("/")
    }
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.put("/:recipeId", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    if (recipe.owner.toString() == req.session.user._id) {
      await Recipe.findByIdAndUpdate(req.params.recipeId, req.body);
      res.redirect(`/recipes/${req.params.recipeId}`);
    } else {
      res.redirect("/")
    }
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});  


module.exports = router;
middleware/is-sign-in.js
// is-signed-in.js
const isSignedIn = (req, res, next) => {
  if (req.session.user) return next();
  res.redirect('/auth/sign-in');
};

module.exports = isSignedIn;

middleware/locals.js
function setUserLocals(req, res, next) {
  res.local.user = res.user || null;
  next();
};

module.exports = setUserLocals;
middleware-pass-user-to-view.js
// middleware/pass-user-to-view.js
const passUserToView = (req, res, next) => {
  res.locals.user = req.session.user ? req.session.user : null
  next()
}

module.exports = passUserToView
models-ingredient.js
const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;

models/recipe.js
const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
    required: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  ingredients: [{
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Ingredient",
  	}]
});
const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;




// const router = require("../controllers/auth");

// router.get('/recipes', (res, req) => {
//   res.render('index.ejs');
// });

// router.get('/recipes/new',(res, req) => { })

// router.get('/recipes/:recipeId',(res, req) => { })

// router.get('/recipes/:recipeId/edit',(res, req) => { })

// router.post('/recipes',(res, req) => { })

// router.put('/recipes/:recipeId',(res, req) => { })

// router.delete('/recipes/:recipeId',(res, req)=>{})
models-user.js
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
view/auth/sign-in.ejs
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign In</title>
</head>
<body>
  <h1>Sign in</h1>
  <form action="/auth/sign-in" method="POST">

    <label for="username">Username:</label>
    <input type="text" name="username" id="username" required />

    <label for="password">Password:</label>
    <input type="password" name="password" id="password" required />

    <button type="submit">Sign in</button>
    
  </form>
</body>
</html>

view/auth/sign-up.ejs
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sign Up</title>
</head>
<body>
  <h1>Create a new account!</h1>
  <form action="/auth/sign-up" method="POST">

    <label for="username">Username:</label>
    <input type="text" name="username" id="username" required />

    <label for="password">Password:</label>
    <input type="password" name="password" id="password" required />

    <label for="confirmPassword">Confirm Password:</label>
    <input 
      type="password"
      name="confirmPassword"
      id="confirmPassword"
      required 
    />

    <button type="submit">Sign up</button>
    
  </form>

</body>
</html>
view/ingredients/index.ejs
