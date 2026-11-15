import express, { json } from "express"
import mysql from "mysql2"
import path from "node:path"

const pool = mysql.createPool({
    "host": "localhost",
    "port": 3306,
    "user": "root",
    "password": "root",
    "database": "booklib"
}).promise()

// TODO: migrate password and username to a .env file

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const port = 3000

function getBookById(id) {
    return pool.query("select * from books where id = ?", [id]).then(result => {
        return result[0][0]
    })
}

function validateData(input) {
    if ( (typeof input != "string") || (input == undefined || input.trim() == "")) {
        return false
    }
    return true
}

app.use(express.static(process.cwd()))

app.get("/", (req,res) => {
    res.sendFile(path.join(process.cwd(), "html", "index.html"))
})

app.get("/catalog", (req,res) => {
    res.sendFile(path.join(process.cwd(), "html", "catalog.html"))
})

app.get("/add", (req,res) => {
    res.sendFile(path.join(process.cwd(), "html", "add-book.html"))
})

app.get("/books", (req,res) => {
    pool.query("select * from books").then(result => {
        res.json(result[0])
    })
})

app.get("/catalog/:id", async (req,res) => {
    const id = Number(req.params.id)
    const book = await getBookById(id)
    res.sendFile(path.join(process.cwd(), "html", "book-details.html"))    
})

app.get("/books/:id", (req,res) => {
    const id = Number(req.params.id)
    getBookById(id).then(book => {
        if (book == undefined) {
            return res.status(404).json({"message": "Book not found"})
        }
        res.json(book)
    })
})

app.post("/books", async (req, res) => {
    const body = req.body

    Object.entries(body).forEach(([key, value]) => {
        if (!validateData(value)) {
            return res.status(400).end()
        }
    })

    const allowedColumns = await pool.query("describe books")
    const allowedColumnsNames = allowedColumns[0].map((column) => column.Field)
    allowedColumnsNames.splice(allowedColumnsNames.indexOf("id"), 1)

    console.log("Allowed columns:", allowedColumnsNames)

    const bodyKeys = Object.keys(body)

    console.log("Body keys:", bodyKeys)

    const hasAllColumns = bodyKeys.every((key) => allowedColumnsNames.includes(key))

    if (!hasAllColumns) {
        return res.status(400).end()
    }

    await pool.query(`insert into books (${allowedColumnsNames.join(", ")}) values (${allowedColumnsNames.map(() => "?").join(", ")})`, allowedColumnsNames.map((name) => body[name].trim())).then( () => {
        res.status(201).end()
    })
})

app.delete("/books/:id", async (req, res) => {
    const id = req.params.id
    await pool.query("delete from books where id = ?", [id]).then(result => {
        result[0].affectedRows === 0 ? res.status(404).json({"message": "Book not found"}) : res.status(204).end()
    })
})

app.patch("/books/:id", async (req, res) => { // partial modification, just one part
    const id = req.params.id

    const body = req.body
    const values = Object.values(body)

    if ( (values.find((value) => validateData(value))) == undefined) {
        return res.status(400).end()
    }

    let allowedColumns = await pool.query("describe books")
    allowedColumns = allowedColumns[0].map((column) => column.Field)
    allowedColumns = allowedColumns.filter((column) => column != "id")

    const availableColumns = [] // "author"
    const availableColumnsValues = [] // "1984"
    let availableColumnsQuery = [] // title = ? , ...

    Object.entries(body).forEach(([key, value]) => {
        if (validateData(value) && allowedColumns.includes(key)) {
            availableColumns.push(key)
            availableColumnsValues.push(value.trim())
        }
    })

    availableColumnsQuery = availableColumns.map((column) => `${column} = ?`)

    if (availableColumnsQuery.length == 0) {
        return res.status(400).end()
    }

    const querySQL = `update books set ${availableColumnsQuery.join(", ")} where id = ?`
    
    availableColumnsValues.push(id)

    await pool.query(querySQL, availableColumnsValues).then(async (result) => {
        if (result[0].affectedRows == 0) {
            const selectedBook = await pool.query(`select * from books where id = ?`, [id])
            if (selectedBook[0].length == 0) {
                return res.status(404).json({"error": "Book not found"})
            }
        }
        return res.status(204).end()
    })
})

app.put("/books/:id", async (req, res) => { // replaces an entire resource
    const id = req.params.id
    const body = req.body

    const keys = Object.keys(body)

    const values = Object.values(body)

    let allowedColumns = await pool.query("describe books")
    allowedColumns = allowedColumns[0].map((column) => column.Field)
    allowedColumns = allowedColumns.filter(column => column != "id")

    const availableColumns = [] // "author"
    const availableColumnsValues = [] // "1984"
    let availableColumnsQuery = [] // title = ? , ...
    
    const hasAllColumns = keys.every((key) => allowedColumns.includes(key))

    if (!hasAllColumns) {
        return res.status(400).end()
    }

    if ( (values.find((value) => !validateData(value)) != undefined) ) {
        return res.status(400).end()
    }

    Object.entries(body).forEach(([key, value]) => {
        if (validateData(value)) {
            availableColumns.push(key)
            availableColumnsValues.push(value.trim())
        }
    })

    availableColumnsQuery = availableColumns.map((column) => `${column} = ?`)

    const querySQL = `update books set ${availableColumnsQuery.join(", ")} where id = ?`
    
    availableColumnsValues.push(id)

    await pool.query(querySQL, availableColumnsValues).then(async (result) => {
        if (result[0].affectedRows == 0) {
            const selectedBook = await pool.query(`select * from books where id = ?`, [id])
            if (selectedBook[0].length == 0) {
                return res.status(404).json({"error": "Book not found"})
            }
        }
        return res.status(204).end()
    })
})

app.use((req,res, next) => {
    res.status(404).sendFile(path.join(process.cwd(), "html", "404.html"))
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})