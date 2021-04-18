const db = require("../config/db")

module.exports = {

    create({filename, path}){
        try{
            const query = `
                INSERT INTO files (
                    name,
                    path
                ) VALUES ($1, $2)
                RETURNING id
            `
            path = String(path).replace("public", "")

            const values = [
                filename,
                path
            ]

            return db.query(query, values)
        } catch(err){
            console.error(err)
        }
    },
    find(fileId){
        try{
            return db.query(`
                SELECT files.path
                FROM files
                WHERE files.id = $1
            `, [fileId])
        } catch(err){
            console.error(err)
        }
    },
    update({filename, path, file_id}){
        try{
            const query = `
                UPDATE files SET
                    name = ($1),
                    path = ($2)
                WHERE id = $3
            `

            path = String(path).replace("public", "")

            const values = [
                filename,
                path,
                file_id
            ]


            return db.query(query, values)
        } catch(err){
            console.error(err)
        }
    },
    recipe(recipeId, fileId){
        try{
            const query = `
                INSERT INTO recipe_files (
                    recipe_id,
                    file_id
                ) VALUES ($1, $2)
                RETURNING id
            `

            const values = [
                recipeId,
                fileId
            ]

            return db.query(query, values)
        } catch(err){
            console.error(err)
        }
    },
    recipeUpdate(recipeId, fileId){
        try{
            return db.query(`
                UPDATE recipe_files SET
                    file_id = ($1)
                WHERE recipe_id = $2
            `,[fileId, recipeId])
        } catch(err){
            console.error(err)
        }
    },
    delete(id){
        try{
            return db.query(`
                DELETE FROM files
                WHERE id = $1
            `, [id])
        } catch(err){
            console.error(err)
        }
    },
    recipeDelete(id){
        try{
            return db.query(`
                DELETE FROM recipe_files
                WHERE file_id = $1
            `, [id])
        } catch(err){
            console.error(err)
        }
    }

    
}