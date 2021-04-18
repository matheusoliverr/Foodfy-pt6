const db = require("../config/db")
const { iso } = require("../../lib/utils")

module.exports = {
    showAll(pageQuery){
        try{
            const { filter } = pageQuery

            let orderBy = ``

            let query = `
                SELECT a.id, a.chef_id, a.title, a.updated_at, a.created_at, ARRAY_AGG(files.path) AS files_path
                FROM (
                    SELECT recipes.*, recipe_files.file_id AS file_id
                    FROM recipes
                    LEFT JOIN recipe_files ON(recipes.id = recipe_files.recipe_id)
                ) AS a
                LEFT JOIN files ON(a.file_id = files.id)
            `

            if(filter){

                query = `${query}
                WHERE a.title ILIKE '%${filter}%'
                `

                orderBy = `
                ORDER BY a.updated_at ASC
                `
            }

            if(!filter){
                orderBy = `
                ORDER BY a.created_at DESC
                `
            }

            query = `${query}
                GROUP BY a.id, a.chef_id, a.title, a.created_at, a.updated_at
                ${orderBy}
            `


            return db.query(query)
        } catch(err){
            console.error(err)
        }
    },

    find(index){
        try{
            return db.query(`
                SELECT a.id, a.chef_id, a.user_id, a.title, a.ingredients, a.preparation, a.information, a.created_at, ARRAY_AGG(files.path) AS files_path, ARRAY_AGG(files.id) AS files_id
                FROM (
                    SELECT recipes.*, recipe_files.file_id AS file_id
                    FROM recipes
                    LEFT JOIN recipe_files ON(recipes.id = recipe_files.recipe_id)
                ) AS a
                LEFT JOIN files ON(a.file_id = files.id)
                WHERE a.id = $1
                GROUP BY a.id, a.chef_id, a.user_id, a.title, a.ingredients, a.preparation, a.information, a.created_at
            `, [index])
        } catch(err){
            new Error(err)
        }
    },

    findChef(id){
        try{
            return db.query(`
                SELECT *
                FROM chefs
                WHERE chefs.id = $1
            `, [id])
        } catch(err){
            console.error(err)
        }
    },

    findFiles(id){
        try{
            return db.query(`
                SELECT recipe_files.file_id
                FROM recipe_files
                WHERE recipe_id = $1
            `, [id])
        } catch(err){
            console.error(err)
        }
    },

    create(data){
        try{
            const query = `
                INSERT INTO recipes (
                    chef_id,
                    user_id,
                    title,
                    ingredients,
                    preparation,
                    information,
                    created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id
            `

            const values = [
                data.chef_id || 0,
                data.user_id || "",
                data.title,
                data.ingredients,
                data.preparation,
                data.information,
                iso(Date.now())
            ]

            return db.query(query, values)
        } catch(err){
            console.error(err)
        }
    },

    selectChef(){
        try{
            return db.query(`
                SELECT *
                FROM chefs
            `)
        } catch(err){
            console.error(err)
        }
    },

    update(data){
        try{
            const query = `
                UPDATE recipes SET
                    chef_id=($1),
                    user_id=($2),
                    title=($3),
                    ingredients=($4),
                    preparation=($5),
                    information=($6)
                WHERE id = $7
            `

            const values = [
                data.chef_id || 0,
                data.user_id || "",
                data.title,
                data.ingredients,
                data.preparation,
                data.information,
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
                DELETE FROM recipes
                WHERE id = $1
            `, [id])
        } catch(err){
            console.error(err)
        }
    },

}