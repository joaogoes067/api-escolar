//middlwares/auth.js
const jwt = require("jsonwebtoken")

const JWT_SECRET = process.env.JWT_SECRET

const auth = (req, res, next) =>{
    const token = req.headers.authorization
    if(!token){
        return res.status(401).json({message: "Acesso negado"})
    }

    try{
        const tokenClean = token.split(' ')[1];
        const decoded = jwt.verify(tokenClean, JWT_SECRET)
        req.userId = decoded.id;
    }catch(err){
        return res.status(401).json({message: "Token inválido"})
    }

    next()
}

module.exports = auth


