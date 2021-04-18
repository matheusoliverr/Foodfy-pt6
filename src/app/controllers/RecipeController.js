const Recipe = require("../models/Recipe")
const File = require("../models/File")
const User = require("../models/User")

module.exports = {
    async index(req,res){
        let results = await Recipe.showAll(req.query)
        let recipes = results.rows

        results = await Recipe.selectChef()
        chefs = results.rows
    
        return res.render("site/main", {recipes, chefs})
        
    },
    async show(req, res){
        const recipeIndex = req.params.index;

        let results = await Recipe.find(recipeIndex)
        const recipe = results.rows[0]

        
        results = await Recipe.findChef(recipe.chef_id)

        const chef = results.rows[0]
    
        return res.render("site/recipe", {recipe, chef})
        
    },
    about(req,res){
        return res.render("site/about")

    },
    async list(req,res){
        let results = await Recipe.showAll(req.query)
        let recipes = results.rows

        results = await Recipe.selectChef()
        chefs = results.rows
        
        return res.render("site/recipes", {recipes, filter: req.query.filter, chefs})
        
    },
    async post(req,res){
        try{
            const keys = Object.keys(req.body)

        
            const filteredKeys = keys.filter(function(key){
                return (key !=='information' && key !=='removed_files')
            })
        
            for(key of filteredKeys){
                if(req.body[key] == ""){
                    return res.send(`Preencha o campo (${key}) para continuar!`)
                }
            }

            if(req.files.length == 0) return res.send("Envie ao menos 1 foto!")

            if(req.session.isAdmin == false){
                req.body.chef_id = 0
                req.body.user_id = req.session.userId
            }

            let results = await Recipe.create(req.body)

            const recipeId = results.rows[0].id

            const filesPromise = req.files.map(async file => {
                results = await File.create({...file})

                const fileId = results.rows[0].id

                await File.recipe(recipeId, fileId)
            })
                
            await Promise.all(filesPromise)

            
            results = await User.findRecipes(req.session.userId)
            const recipes = results.rows

            const chef = await User.find({ where: {id: req.session.userId} })
            
            
            return res.render("admin/recipes/listing", {
                recipes,
                chef,
                success: "Receita cadastrada com sucesso!"
            })
        } catch(err){
            console.error(err)
            return res.render("admin/recipes/create", {
                user: req.body,
                error: "Ocorreu algum erro. Tente novamente!"
            })
        }
    
    },
    async put(req,res){
        try{
            const keys = Object.keys(req.body)
        
            const filteredKeys = keys.filter(function(key){
                return (key !=='information' && key !== "removed_files" && key !== "file_id")
            })
        
            for(key of filteredKeys){
                if(req.body[key] == ""){
                    return res.send(`Preencha o campo (${key}) para continuar!`)
                }
            }


            if(req.files.length != 0){
                const newFilesPromise = req.files.map(async file =>{
                    const results = await File.create({...file})
                    const fileId = results.rows[0].id

                    await File.recipe(req.body.id, fileId)

                })
                await Promise.all(newFilesPromise)
            }
            

            if(req.body.removed_files){
                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)

                const removedFilesPromise = removedFiles.map(id =>{
                    File.delete(id)
                    File.recipeDelete(id)
                })
                await Promise.all(removedFilesPromise)
            }

            if(req.session.isAdmin == false){
                req.body.chef_id = 0
                req.body.user_id = req.session.userId
            }

            await Recipe.update(req.body)

            let results = await Recipe.find(req.body.id)
            const recipe = results.rows[0]

            results = await Recipe.findChef(recipe.chef_id)
            const chef = results.rows[0]

            return res.render("admin/recipes/recipe", {
                recipe,
                chef,
                success: "Receita atualizada com sucesso!"
            })
        } catch(err){
            console.error(err)
            return res.render("admin/recipes/edit", {
                user: req.body,
                error: "Ocorreu algum erro. Tente novamente!"
            })
        }

    },
    async delete(req,res){
        let results = await Recipe.find(req.body.id)
        const recipe = results.rows[0]

        results = await Recipe.selectChef()
        const chefs = results.rows

        try{
            const { id } = req.body
            results = await Recipe.findFiles(id)
            const files = results.rows

            

            const deleteFiles = files.map(file => {
                File.recipeDelete(file.file_id).then(
                    File.delete(file.file_id)
                )
            })

            await Promise.all(deleteFiles)

            await Recipe.delete(id)

            const chef = await User.find({ where: {id: req.session.userId} })

            results = await User.findRecipes(req.session.userId)
            let recipes = results.rows

            
            return res.render("admin/recipes/listing", {
                recipes,
                chef,
                success: "Receita deletada com sucesso!"

            })
        } catch(err){
            console.error(err)
            return res.render("admin/recipes/edit", {
                recipe,
                chefs,
                error: "Ocorreu algum erro. Tente novamente!"
            })
        }
    }
}
