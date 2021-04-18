const Chef = require("../models/Chef")
const File = require("../models/File")

module.exports = {
    async index(req,res){
        const results = await Chef.showAll()
        const chefs = results.rows

        return res.render("admin/chefs/listing", {chefs})
        
    },
    create(req,res){

        return res.render("admin/chefs/create")
    },
    async post(req,res){

        try{
            const keys = Object.keys(req.body)
        
            for(key of keys){
                if(req.body[key] == "" && key!=="file_id"){
                    return res.send(`Preencha o campo (${key}) para continuar!`)
                }
            }

            let results = await File.create({...req.file})
            const fileId = results.rows[0].id

            await Chef.create(req.body, fileId)

            results = await Chef.showAll()
            const chefs = results.rows
            
            return res.render("admin/chefs/listing", {
                chefs,
                success: "Chef registrado com sucesso!"
            })
        } catch(err){
            console.error(err)
            return res.render("admin/chefs/create", {
                error: "Ocorreu algum erro. Tente novamente!"
            })

        }
       
    },
    async show(req, res){
        const chefIndex = req.params.index;

        let results = await Chef.find(chefIndex)
        const chef = results.rows[0]
        const chefFileId = results.rows[0].file_id

        results = await File.find(chefFileId)
        let chefFilePath = results.rows[0].path

        results = await Chef.recipeFind(chef.id)
        const recipes = results.rows

        
        return res.render("admin/chefs/chef", {chef, recipes, file_path: chefFilePath});
       
    },
    async edit(req,res){
        const chefIndex = req.params.index;

        const results = await Chef.find(chefIndex)
        const chef = results.rows[0]
        
        return res.render("admin/chefs/edit", {chef});
        
    },
    async put(req,res){

        try{
            const keys = Object.keys(req.body)
        
            for(key of keys){
                if(req.body[key] == "" && key!=="file_id" && key!=="id"){
                    return res.send(`Preencha o campo (${key}) para continuar!`)
                }
            }

            if(req.file){

                const file  = {
                    ...req.file,
                    file_id: req.body.file_id
                }
    
                await File.update({...file})
            }
            

            await Chef.update(req.body)

            let results = await Chef.find(req.body.id)
            req.body.total_recipes = results.rows[0].total_recipes

            results = await Chef.recipeFind(req.body.id)
            const recipes = results.rows

            let filePath = ""

            if(req.file){
                filePath = String(req.file.path).replace("public", "")
            } else{
                results = await File.find(req.body.file_id)
                filePath = results.rows[0].path
            }
            
            return res.render("admin/chefs/chef", {
                chef: req.body,
                recipes,
                file_path: filePath,
                success: "Chef atualizado com sucesso!"
            })
        } catch(err){
            console.error(err)
            return res.render("admin/chefs/edit", {
                chef: req.body,
                error: "Ocorreu algum erro. Tente novamente!"
            })

        }
    
    },

    async delete(req,res){
        try{
            if(req.body.total_recipes != 0){
                return res.send("Chefs que possuem receitas cadastradas não podem ser deletados!")
            }
            
            await Chef.delete(req.body.id)

            const results = await Chef.showAll()
            const chefs = results.rows
        
            return res.render("admin/chefs/listing", {
                chefs,
                success: "Chef deletado com sucesso!"
            })
        } catch(err){
            console.error(err)
            return res.render("admin/chefs/create", {
                chef: req.body,
                error: "Ocorreu algum erro. Tente novamente!"
            })

        }
        
    },
    async list(req,res){
        const results = await Chef.showAll()
        const chefs = results.rows
        
        return res.render("site/chefs", { chefs })
        
    }
}
