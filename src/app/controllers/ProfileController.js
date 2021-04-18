const User = require("../models/User")
const Recipe = require("../models/Recipe")
const { hash } = require("bcryptjs")

module.exports = {
    async index(req, res){
        const id = req.session.userId

        const user = await User.find({where: {id}})

        
        const name = user.name.split(" ")
        const shortName = name[0]

        return res.render("admin/users/profile", {user, shortName})
    },
    async put(req, res){
        try{
            console.log(req.user)
            req.body.password = await hash(req.body.password, 8)
            await User.update(req.user.id, {
                name: req.user.name,
                email: req.user.email
            })

            let results = await Recipe.showAll(req.query)
            let recipes = results.rows

            results = await Recipe.selectChef()
            chefs = results.rows

            return res.render("site/main", {
                recipes,
                chefs,
                success: "Perfil atualizado com sucesso!"
            })
        } catch(err){
            console.error(err)
            return res.render("admin/users/profile", {
                user: req.body,
                error: "Ocorreu algum erro. Tente novamente!"
            })
        }
    },
    async show(req, res){
        const id = req.session.userId

        const chef = await User.find({ where: {id} })

        const results = await User.findRecipes(id)
        const recipes = results.rows


        return res.render("admin/recipes/listing", {
            recipes,
            chef
        })
    },
    async createRecipe(req, res){
        const id = req.session.userId

        const results = await User.find({ where: {id} })
        const chef = results

        return res.render("admin/recipes/create", {chef})
        
        
    }
}