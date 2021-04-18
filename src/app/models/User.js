const db = require("../config/db")
const { hash } = require('bcryptjs')

module.exports = {
    showAll(){
        try{
            return db.query(`
                SELECT *
                FROM users
            `)
        } catch(err){
            console.error(err)
        }
    },

    async find(filters){
        try{

            let query = `SELECT * FROM users`

            if(filters){

                Object.keys(filters).map(key =>{
                    query = `${query}
                    ${key}
                    `
        
                    Object.keys(filters[key]).map(field =>{
                        query = `${query} ${field} = '${filters[key][field]}'`
                    })
                })
            }

            const results = await db.query(query)

            return results.rows[0]

        } catch(err){
            console.error(err)
        }
    },

    findRecipes(id){
        return db.query(`
            SELECT a.id, a.user_id, a.title, a.ingredients, a.preparation, a.information, a.created_at, ARRAY_AGG(files.path) AS files_path, ARRAY_AGG(files.id) AS files_id
            FROM (
                SELECT recipes.*, recipe_files.file_id AS file_id
                FROM recipes
                LEFT JOIN recipe_files ON(recipes.id = recipe_files.recipe_id)
            ) AS a
            LEFT JOIN files ON(a.file_id = files.id)
            WHERE a.user_id = $1
            GROUP BY a.id, a.user_id, a.chef_id, a.title, a.ingredients, a.preparation, a.information, a.created_at
        `, [id])
    },

    async create(data){
        try{
            const query = `
                INSERT INTO users (
                    name,
                    email,
                    password,
                    is_admin
                ) VALUES ($1, $2, $3, $4)
            `

            const cryptedPassword = await hash(data.password, 8)

            const values = [
                data.name,
                data.email,
                cryptedPassword,
                data.is_admin
            ]

            return db.query(query, values)
        } catch(err){
            console.error(err)
        }
    },

    async update(id, fields){
        try{
            let query = "UPDATE users SET"

            Object.keys(fields).map((key, index, array) => {
                if((index + 1) < array.length){
                    query = `${query}
                        ${key} = '${fields[key]}',
                    `
                } else{
                    query = `${query}
                        ${key} = '${fields[key]}'
                        WHERE id = ${id}
                    `
                }
            })

            console.log(query)

            await db.query(query)

            return

        } catch(err){
            console.error(err)
        }
    },

    updateToken(data){
        try{
            const query = `
                UPDATE users SET
                    reset_token = ($1),
                    reset_token_expires = ($2)
                WHERE id = $3
            `

            const values = [
                data.reset_token,
                data.reset_token_expires,
                data.id
            ]

            return db.query(query, values)
        } catch(err){
            console.error(err)
        }
    },

    adminUpdate(data){
        try{
            const query = `
                UPDATE users SET
                    name = ($1),
                    email = ($2),
                    is_admin = ($3)
                WHERE id = $4
            `

            const values = [
                data.name,
                data.email,
                data.is_admin,
                data.id
            ]

            return db.query(query, values)
        } catch(err){
            console.error(err)
        }
    },

    delete(id){
        try{
            return db.query(`
                DELETE FROM users
                WHERE id = $1
            `, [id])
        } catch(err){
            console.error(err)
        }
    }
}