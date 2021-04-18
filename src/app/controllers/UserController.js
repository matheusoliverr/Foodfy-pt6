const User = require("../models/User")
const Recipe = require("../models/Recipe")

const crypto = require('crypto')
const mailer = require("../../lib/mailer")

module.exports = {
    async list(req, res){
        const results = await User.showAll()

        users = results.rows

        return res.render("admin/users/listing", {users})
    },
    create(req, res){
        return res.render("admin/users/create")
    },
    async post(req, res){
        try{
            const randomPassword = crypto.randomBytes(4).toString("hex")
            req.body.password = randomPassword

            const name = req.body.name.split(" ")

            const shortName = name[0]

            await mailer.sendMail({
                to: req.body.email,
                from: 'no-reply@foodfy.com.br',
                subject: "Bem vindo ao Foodfy",
                html: `<h2>Bem vindo ao Foodfy, ${shortName}</h2>
                <p>Você foi convidado a se tornar usuário da nossa plataforma Foodfy!</p>
                <p>Venha conhecer nossa comunidade apaixonada pela culinária e nos ajude com suas próprias receitas.</p>
                <p>Para conhecer a plataforma clique no link abaixo. Sua senha é: ${req.body.password}</p>
                <p>
                    <a href="http://localhost:3000/login" target="_blank"> Clique Aqui </a>
                </p>
                `,
            })

            if(req.body.is_admin != "on") req.body.is_admin = false

            await User.create(req.body)

            let results = await User.showAll()
            const users = results.rows

            return res.render("admin/users/listing", {
                users,
                success: "Usuário criado com sucesso!"
            })
        } catch(err){
            console.error(err)
            return res.render("admin/users/create", {
                user: req.body,
                error: "Ocorreu algum erro. Tente novamente!"
            })
        }
    },
    async edit(req, res){

        const userId = req.params.id;

        const user = await User.find({ where: {id: userId}})

        return res.render("admin/users/edit", {user})
    },
    async put(req, res){
        try{
            if(req.body.is_admin != "on") req.body.is_admin = false

            await User.update(req.body.id, {
                ...req.body
            })

            return res.render("admin/users/edit", {
                user: req.body,
                success: "Usuário atualizado com sucesso!"
            })
        } catch(err){
            console.error(err)
            return res.render("admin/users/edit", {
                user: req.body,
                error: "Ocorreu algum erro. Tente novamente!"
            })
        }
    },
    async delete(req, res){
        const user = await User.find({ where: {id: req.body.id}})
        
        try{
            const { id } = req.body

            let results = await User.findRecipes(id)
            const recipes = results.rows

            const recipesPromise = recipes.map(async recipe => {

                results = await Recipe.findFiles(recipe.id)
                const files = results.rows

                const deleteFiles = files.map(file => {
                    File.recipeDelete(file.file_id).then(
                        File.delete(file.file_id)
                    )
                })

                await Promise.all(deleteFiles)

                await Recipe.delete(recipe.id)
            })

            await Promise.all(recipesPromise)

            await User.delete(id)

            results = await User.showAll()
            const users = results.rows

            return res.render("admin/users/listing", {
                users,
                success: "Usuário deletado com sucesso"
            })

        } catch(err){
            console.error(err)
            return res.render("admin/users/edit", {
                user,
                error: "Ocorreu algum erro. Tente novamente!"
            })
        }
    }
}