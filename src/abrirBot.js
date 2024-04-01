(function(){
    let mensaje = ["modelo.py"]
    const botonMandarDatos = document.querySelector(".mandar-datos")
    const chat = document.querySelector(".chat")
    const chatInput = document.querySelector(".chat-input")

    function determinarSioNo(dato){
        if(dato.toLowerCase()=== "si")
        mensaje.push("1")
    }else{
        mensaje.push("0")
    }

    async function mandarDatos(){
        chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg"><p class="text-sm font-bold">La predicción puede tardar un poco, por favor le pedimos paciencia y no mande los datos nuevamente</p></div></div>`
    
        try{
            const url = "api/bot"
            const respuesta = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mensaje),
            })

            const {resultado, estado} = await respuesta.json()
            console.log(resultado)
            const entero = parseInt(resultado)
            switch(entero){
                case 0: chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg"><p class="text-sm font-bold">Usted puede estar padeciendo de COVID-19  <a href="http://localhost:3000/especializaciones/1" class="bg-red-600 w-full text-center block font-bold p-2 text-white uppercase rounded">Ver Talleres</a> Esta predicción no es 100% precisa, por lo cual se recomienda ser escaneado</p></div></div>`
                        break
            }

        } catch(error){
            console.log(error);
        }
    }

})()