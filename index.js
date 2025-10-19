// index.js (
const express = require("express");
const publicRoutes = require("./routes/public.js");
const privateRoutes = require("./routes/private.js");
const auth = require("./middlewares/auth.js");


const app = express();
const PORTA = 3000;


app.use(express.json());

app.use("/", publicRoutes);
app.use("/", auth, privateRoutes);

app.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
  console.log(`http://localhost:${PORTA}`);
});





//jaalvesgoes_db_user

//5AmOqukK7kagtB2u

//mongodb+srv://jaalvesgoes_db_user:5AmOqukK7kagtB2u@cluster0.hiykwt5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0


