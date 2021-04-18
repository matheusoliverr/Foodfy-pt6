const Recipe = require("../models/Recipe")
const File = require("../models/File")
const User = require("../models/User")

module.exports = {
    async index(req,res){
        if(req.session.isAdmin == true){
            let results = await Recipe.showAll(req.query)
            let recipes = results.rows

            results = await Recipe.selectChef()
            chefs = results.rows

            return res.render("admin/recipes/listing", {recipes, chefs})
        } else {
            return res.redirect("/admin/profile/recipes")
        }
        
    },
    async create(req,res){
        const results = await Recipe.selectChef()
        const chefs = results.rows

        return res.render("admin/recipes/create", {chefs})
    
    },
    async show(req,res){
        const recipeIndex = req.params.index;

        let results = await Recipe.find(recipeIndex)
        const recipe = results.rows[0]

        let chef = ""

        if(recipe.user_id){
            chef = await User.find({ where: {id: req.session.userId} })

        } else{
            results = await Recipe.findChef(recipe.chef_id)
            chef = results.rows[0]
        }
        
        return res.render("admin/recipes/recipe", {recipe, chef});
        
    },
    async edit(req,res){
        const recipeIndex = req.params.index;

        let results = await Recipe.find(recipeIndex)
        const recipe = results.rows[0]
        results = await Recipe.selectChef()
        const chefs = results.rows
        
        return res.render("admin/recipes/edit", {recipe, chefs});

    },
    
}
