const express = require('express')
const routes = express.Router()
const multer = require("./app/middlewares/multer")

const RecipeController = require("./app/controllers/RecipeController")
const AdminController = require("./app/controllers/AdminController")
const ChefController = require("./app/controllers/ChefController")
const UserController = require("./app/controllers/UserController")
const ProfileController = require("./app/controllers/ProfileController")
const SessionController = require("./app/controllers/SessionController")

const SessionValidator = require("./app/validators/session")
const UserValidator = require("./app/validators/user")
const RouteValidator = require("./app/validators/routes-block")

routes.get("/", RecipeController.index)
routes.get("/login", SessionController.loginForm)
routes.post("/login", SessionValidator.login, SessionController.login)
routes.post("/logout", RouteValidator.user, SessionController.logout)
routes.get("/forgot-password", SessionController.forgotForm)
routes.post("/forgot-password", SessionValidator.forgot, SessionController.forgot)
routes.get("/reset-password", SessionController.resetForm)
routes.post("/reset-password", SessionValidator.reset, SessionController.reset)


routes.get("/main", RecipeController.index)
routes.get("/recipes/:index", RecipeController.show)
routes.get("/about", RecipeController.about)
routes.get("/recipes", RecipeController.list)
routes.post("/admin/recipes", RouteValidator.user, multer.array("file", 5), RecipeController.post)
routes.put("/admin/recipes", RouteValidator.user, multer.array("file", 5), RecipeController.put)
routes.delete("/admin/recipes", RouteValidator.user, RecipeController.delete)


routes.get("/chefs", ChefController.list)
routes.get("/admin/chefs", RouteValidator.admin, ChefController.index)
routes.get("/admin/chefs/create", RouteValidator.admin, ChefController.create)
routes.get("/admin/chefs/:index", RouteValidator.admin, ChefController.show)
routes.get("/admin/chefs/:index/edit", RouteValidator.admin, ChefController.edit)


routes.get("/admin/recipes", RouteValidator.user, AdminController.index)
routes.get("/admin/recipes/create", RouteValidator.user, AdminController.create)
routes.get("/admin/recipes/:index", RouteValidator.recipe, RouteValidator.user, AdminController.show)
routes.get("/admin/recipes/:index/edit", RouteValidator.recipe, RouteValidator.user, AdminController.edit)



routes.post("/admin/chefs", RouteValidator.admin, multer.single("path_file", 5), ChefController.post)
routes.put("/admin/chefs", RouteValidator.admin, multer.single("path_file", 5), ChefController.put)
routes.delete("/admin/chefs", RouteValidator.admin, ChefController.delete)

// Rotas de perfil de um usu??rio logado
routes.put('/admin/profile', RouteValidator.user, UserValidator.profile, ProfileController.put)// Editar o usu??rio logado
routes.get('/admin/profile', RouteValidator.user, ProfileController.index) // Mostrar o formul??rio com dados do usu??rio logado
routes.get('/admin/profile/recipes', RouteValidator.user, ProfileController.show)
routes.get('/admin/profile/recipes/create', RouteValidator.user, ProfileController.createRecipe)

// Rotas que o administrador ir?? acessar para gerenciar usu??rios
routes.get('/admin/users', RouteValidator.admin, UserController.list) // Mostrar a lista de usu??rios cadastrados
routes.post('/admin/users', RouteValidator.admin, UserValidator.post, UserController.post) // Cadastrar um usu??rio
routes.get('/admin/users/create', RouteValidator.admin, UserController.create) // Mostrar o formul??rio de cria????o de um usu??rio
routes.put('/admin/users/:id', RouteValidator.admin, UserValidator.put, UserController.put) // Editar um usu??rio
routes.get('/admin/users/:id/edit', RouteValidator.admin, UserController.edit) // Mostrar o formul??rio de edi????o de um usu??rio
routes.delete('/admin/users/:id', RouteValidator.admin, UserController.delete) // Deletar um usu??rio

module.exports = routes