import jwt from "jsonwebtoken";

const generarJWT = datos => jwt.sign({id: datos.id, nombre: datos.nombre}, "papagaiodomar", {expiresIn: "1d"})

export {
    generarJWT
}