import jwt from "jsonwebtoken";

const generarJWT = (datos) => {
    return jwt.sign(datos, "papagaiodomar", {expiresIn: "1d"})
}

export {
    generarJWT
}