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