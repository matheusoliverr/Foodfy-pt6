const { compare } = require("bcryptjs")
const User = require("../models/User")

async function login(req, res, next){
    const { email, password } = req.body

    const user = await User.find({ where: {email} })

    if(!user){
        return res.render("site/users/login", {
            user: req.body,
            error: "Este usuário não está cadastrado!"
        })
    }

    const checkPassword = await compare(password, user.password)

    if(checkPassword==false){
        return res.render("site/users/login", {
            user: req.body,
            error: "Senha incorreta!"
        })
    }

    req.user = user

    next()
}

async function forgot(req, res, next){
    const { email } = req.body

    let user = await User.find({where: {email}})

    if(!user){
        return res.render("site/users/forgot-password", {
            error: "Email incorreto!"
        })
    }

    req.user = user

    next()
}

async function reset(req, res, next){
    const { email, password, passwordRepeat } = req.body

    const user = await User.find({where: {email}})

    if(!user){
        return res.render("site/users/reset-password", {
            error: "Usúario não encontrado"
        })
    }

    if(password != passwordRepeat){
        return res.render("site/users/reset-password", {
            error: "Repetição de senha incorreta."
        })
    }

    req.user = user
    req.user.password = password

    next()
}

module.exports = {
    login,
    forgot,
    reset
}