const express = require("express")
const cors = require("cors")
const  mysql = require("mysql2/promise")

require('dotenv').config();

const api = express();
api.use(cors());
api.use(express.json());

const port = process.env.PORT;
api.listen(port, () =>{
  console.log (`Server is running in http://localhost:${port}`)
});

async function connectDB() {
  const conex = await mysql.createConnection({
    host:'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
  });
  conex.connect();
  console.log(conex);
  return conex;
}

 connectDB();

 api.post('/libros', async (req, res) => {

  const {nombre, autor, paginas} = req.body;

  if (!nombre|| !autor|| !paginas) {
    res.status(400).json({
      success: false,
      message: "Texto mínimamente descriptivo del error",
});
}else{
  const conex = await connectDB();
  const sql =
   'INSERT INTO libros (nombre, autor, paginas) values (?, ?, ?,)';
  const [result] =await conex.query(sql, [nombre, autor, paginas]);
    res.status(200).json({
    succes:true,
    id:result.insertId,
 } )
  }
});

api.get('/libros', async (req, res) => {
  try {
    const conex = await connectDB();
    const sql = "SELECT * FROM libros";
    const [result] = await conex.query(sql);

    conex.end();

    res.status(200).json({
      "info": { "count": result.length},
      "results": result
    });

  }catch (error) {
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
})
  }
});

api.get('/libros/:id' , async (req,res) =>{

  const id = req.params.id;

  const conex = await connectDB();
  const sql = 'SELECT *FROM libros WHERE id = ?';
  const [result] = await conex.query(sql, [id]);

  conex.end();
  res.status(200).json({
    success: true,
    result: result [0],
  })
});

api.put('/libros/:id', async (req, res) => {
  const id = req.params.id;
  const {nombre, autor, paginas} =req.body;


  const conex = await connectDB();
  const sql =
    "UPDATE libros  SET nombre= ?, autor= ?, paginas= ? WHERE id= ?";

    const[result] = await conex.query (sql, [
      nombre,
      autor,
      paginas,
      id,
    ]);
    conex.end();
    res.status(200).json({
      success:true,
      message:'Datos actualizados correctamente'
    })
});

api.delete('/libros/:id,', async (req, res) =>{
 const id = req.params.id;
 const conex = await connectDB();
 const sql = 'DELETE FROM libros WHERE id = ?'
 const [result] = await conex.query (sql, [id]);
});

if(result.affectedRows > 0) {
  res.status(200).json({
    succes: true,
    messaje:'Eliminado con exito'});
  }else{
    res.status(500).json({
      success: false,
      message:'No pudo eliminarse'
    });
  }

