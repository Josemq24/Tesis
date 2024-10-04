(function(){

        function determinarSioNo(dato){
                if(dato.toLowerCase() === "si"){
                mensaje.push("1")
                }else{
                mensaje.push("0")
                }
        }
        async function mandarDatos(datos){
                console.log(datos)
                try{
                const url = "/usebot"
                const respuesta = await fetch(url, {
                        method: "POST",
                        headers: {
                        'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(mensaje)
                })
                const {resultado, estado} = await respuesta.json()
                console.log(resultado)
                const entero = parseInt(resultado)
                switch(entero){
                        case 0: chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">Usted puede estar padeciendo de COVID-19, se le recomienda ver a un internista <a href="http://localhost:4000/addUser" class="bg-red-600 w-full text-center block font-bold p-2  uppercase rounded">Reservar Cita</a></div></div>`
                                break
                        case 1: chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">Usted puede estar padeciendo de RESFRIADO, se le recomienda ver a un neumonólogo <a href="http://localhost:4000/addUser" class="bg-red-600 w-full text-center block font-bold p-2  uppercase rounded">Reservar Cita</a></div></div>`
                                break
                        case 2: chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">Usted puede estar padeciendo de GRIPE, se le recomienda ver a un internista <a href="http://localhost:4000/addUser" class="bg-red-600 w-full text-center block font-bold p-2  uppercase rounded">Reservar Cita</a></div></div>`
                                break
                        case 3: chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">Usted puede estar padeciendo de INTOXICACIÓN ALIMENTARIA, se le recomienda ver a un gastroenterólogo <a href="http://localhost:4000/addUser" class="bg-red-600 w-full text-center block font-bold p-2  uppercase rounded">Reservar Cita</a></div></div>`
                                break
                        case 4: chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">Usted puede estar padeciendo de SINUSITIS, se le recomienda ver a un otorrinolaringólogo <a href="http://localhost:4000/addUser" class="bg-red-600 w-full text-center block font-bold p-2  uppercase rounded">Reservar Cita</a></div></div>`
                                break
                        case 5: chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">Usted puede estar padeciendo de BRONQUITIS, se le recomienda ver a un neumonólogo <a href="http://localhost:4000/addUser" class="bg-red-600 w-full text-center block font-bold p-2  uppercase rounded">Reservar Cita</a></div></div>`
                                break
                        case 6: chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">Usted puede estar padeciendo de INFECCIÓN DE GARGANTA, se le recomienda ver a un otorrinolaringólogo <a href="http://localhost:4000/addUser" class="bg-red-600 w-full text-center block font-bold p-2  uppercase rounded">Reservar Cita</a></div></div>`
                                break
                        case 7: chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">Usted puede estar padeciendo de ALERGIA, se le recomienda ver a un inmunólogo <a href="http://localhost:4000/addUser" class="bg-red-600 w-full text-center block font-bold p-2  uppercase rounded">Reservar Cita</a></div></div>`
                                break
                }

                } catch(error){
                console.log(error);
                }
        }

        const chatInput = document.querySelector(".chat-input")
        const chat = document.querySelector(".chat")
        let mensaje = ["modelo.py"]
        let contador = 1
        let resultado
        chatInput.addEventListener("keydown", (e)=>{
                if(e.code === "Enter"){
                        switch(contador){
                                case 1: resultado = chatInput.value
                                        determinarSioNo(resultado)
                                        contador += 1
                                        chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end""><div class="bg-blue-600  p-3 rounded-l-lg rounded-br-lg"><p class="text-sm font-bold"> ${chatInput.value} </p></div></div>`
                                        chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg"><p class="text-sm font-bold">¿Usted tiene dolor de cabeza? (responda si o no)</p></div></div>`
                                        chatInput.value=""
                                        break
                                case 2: resultado = chatInput.value
                                        determinarSioNo(resultado)
                                        contador += 1
                                        chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end""><div class="bg-blue-600  p-3 rounded-l-lg rounded-br-lg"><p class="text-sm font-bold"> ${chatInput.value} </p></div></div>`
                                        chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg"><p class="text-sm font-bold">¿Usted tiene tos? (responda si o no)</p></div></div>`
                                        chatInput.value=""
                                        break
                                case 3: resultado = chatInput.value
                                        determinarSioNo(resultado)
                                        contador += 1
                                        chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end""><div class="bg-blue-600  p-3 rounded-l-lg rounded-br-lg"><p class="text-sm font-bold"> ${chatInput.value} </p></div></div>`
                                        chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg"><p class="text-sm font-bold">¿Usted siente fatiga? (responda si o no)</p></div></div>`
                                        chatInput.value=""
                                        break
                                case 4: resultado = chatInput.value
                                        determinarSioNo(resultado)
                                        contador += 1
                                        chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end""><div class="bg-blue-600  p-3 rounded-l-lg rounded-br-lg"><p class="text-sm font-bold"> ${chatInput.value} </p></div></div>`
                                        chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg"><p class="text-sm font-bold">¿Usted tiene dificultad para respirar? (responda si o no)</p></div></div>`
                                        chatInput.value=""
                                        break
                                case 5: resultado = chatInput.value
                                        determinarSioNo(resultado)
                                        contador += 1
                                        chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end""><div class="bg-blue-600  p-3 rounded-l-lg rounded-br-lg"><p class="text-sm font-bold"> ${chatInput.value} </p></div></div>`
                                        chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg"><p class="text-sm font-bold">¿Usted tiene pérdida del gusto/olfato? (responda si o no)</p></div></div>`
                                        chatInput.value=""
                                        break
                                case 6: resultado = chatInput.value
                                        determinarSioNo(resultado)
                                        contador += 1
                                        chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end""><div class="bg-blue-600  p-3 rounded-l-lg rounded-br-lg"><p class="text-sm font-bold"> ${chatInput.value} </p></div></div>`
                                        chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg"><p class="text-sm font-bold">¿Usted tiene dolor muscular? (responda si o no)</p></div></div>`
                                        chatInput.value=""
                                        break
                                case 7: resultado = chatInput.value
                                        determinarSioNo(resultado)
                                        contador += 1
                                        chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end""><div class="bg-blue-600  p-3 rounded-l-lg rounded-br-lg"><p class="text-sm font-bold"> ${chatInput.value} </p></div></div>`
                                        chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg"><p class="text-sm font-bold">¿Usted ha tenido contacto cercano con alguna persona infectada con Covid-19 en los últimos 14 días? (responda si o no)</p></div></div>`
                                        chatInput.value=""
                                        break
                                case 8: resultado = chatInput.value
                                        determinarSioNo(resultado)
                                        contador += 1
                                        chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end""><div class="bg-blue-600  p-3 rounded-l-lg rounded-br-lg"><p class="text-sm font-bold"> ${chatInput.value} </p></div></div>`
                                        chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg"><p class="text-sm font-bold">¿Usted tiene Náuseas/Vómitos? (responda si o no)</p></div></div>`
                                        chatInput.value=""
                                        break
                                case 9: resultado = chatInput.value
                                        determinarSioNo(resultado)
                                        contador += 1
                                        chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end""><div class="bg-blue-600  p-3 rounded-l-lg rounded-br-lg"><p class="text-sm font-bold"> ${chatInput.value} </p></div></div>`
                                        chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg"><p class="text-sm font-bold">¿Usted tiene Diarrea? (responda si o no)</p></div></div>`
                                        chatInput.value=""
                                        break   
                                case 10: resultado = chatInput.value
                                        determinarSioNo(resultado)
                                        contador += 1
                                        chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end""><div class="bg-blue-600  p-3 rounded-l-lg rounded-br-lg"><p class="text-sm font-bold"> ${chatInput.value} </p></div></div>`
                                        chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg"><p class="text-sm font-bold">La predicción puede tardar un poco, por favor le pedimos paciencia y no mande los datos nuevamente</p></div></div>`
                                        chatInput.value=""
                                        mandarDatos(mensaje)
                                        break
                        }       
                }
        })
})()

// (function(){
//         let mensaje = ["modelo.py"]
//         const botonMandarDatos = document.querySelector(".mandar-datos")
//         const chat = document.querySelector(".chat")
//         const chatInput = document.querySelector(".chat-input")
    
//         function determinarSioNo(dato){
//             if(dato.toLowerCase() === "si"){
//             mensaje.push("1")
//             }else{
//                 mensaje.push("0")
//             }
//         }
    
//         async function mandarDatos(){
//             chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg"><p class="text-sm font-bold">La predicción puede tardar un poco, por favor le pedimos paciencia y no mande los datos nuevamente</p></div></div>`
        
//             try{
//                 const url = "api/bot"
//                 const respuesta = await fetch(url, {
//                     method: "POST",
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify(mensaje),
//                 })
    
//                 const {resultado, estado} = await respuesta.json()
//                 console.log(resultado)
//                 const entero = parseInt(resultado)
//                 switch(entero){
//                     case 0: chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">< class="text-sm font-bold">Usted puede estar padeciendo de COVID-19, se le recomienda ver a un internista <a href="http://localhost:4000/addUser" class="bg-red-600 w-full text-center block font-bold p-2  uppercase rounded">Reservar Cita</a></div></div>`
//                             break
//                     case 1: chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">< class="text-sm font-bold">Usted puede estar padeciendo de RESFRIADO, se le recomienda ver a un neumonólogo <a href="http://localhost:4000/addUser" class="bg-red-600 w-full text-center block font-bold p-2  uppercase rounded">Reservar Cita</a></div></div>`
//                             break
//                     case 2: chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">< class="text-sm font-bold">Usted puede estar padeciendo de GRIPE, se le recomienda ver a un internista <a href="http://localhost:4000/addUser" class="bg-red-600 w-full text-center block font-bold p-2  uppercase rounded">Reservar Cita</a></div></div>`
//                             break
//                     case 3: chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">< class="text-sm font-bold">Usted puede estar padeciendo de INTOXICACIÓN ALIMENTARIA, se le recomienda ver a un gastroenterólogo <a href="http://localhost:4000/addUser" class="bg-red-600 w-full text-center block font-bold p-2  uppercase rounded">Reservar Cita</a></div></div>`
//                             break
//                     case 4: chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">< class="text-sm font-bold">Usted puede estar padeciendo de SINUSITIS, se le recomienda ver a un otorrinolaringólogo <a href="http://localhost:4000/addUser" class="bg-red-600 w-full text-center block font-bold p-2  uppercase rounded">Reservar Cita</a></div></div>`
//                             break
//                     case 5: chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">< class="text-sm font-bold">Usted puede estar padeciendo de BRONQUITIS, se le recomienda ver a un neumonólogo <a href="http://localhost:4000/addUser" class="bg-red-600 w-full text-center block font-bold p-2  uppercase rounded">Reservar Cita</a></div></div>`
//                             break
//                     case 6: chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">< class="text-sm font-bold">Usted puede estar padeciendo de INFECCIÓN DE GARGANTA, se le recomienda ver a un otorrinolaringólogo <a href="http://localhost:4000/addUser" class="bg-red-600 w-full text-center block font-bold p-2  uppercase rounded">Reservar Cita</a></div></div>`
//                             break
//                     case 7: chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">< class="text-sm font-bold">Usted puede estar padeciendo de ALERGIA, se le recomienda ver a un inmunólogo <a href="http://localhost:4000/addUser" class="bg-red-600 w-full text-center block font-bold p-2  uppercase rounded">Reservar Cita</a></div></div>`
//                             break
//                 }
    
//             } catch(error){
//                 console.log(error);
//             }
//         }
    
//         let contador = 0;
//         let resultado
//         chatInput.addEventListener("keydown", (e)=>{
//             if(e.code === "Enter"){
//                 switch(contador){
//                     case 0: mensaje.push(chatInput.value)
//                             contador += 1
//                             chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end""><div class="bg-blue-600  p-3 rounded-l-lg rounded-br-lg"><p class="text-sm font-bold"> ${chatInput.value} </p></div></div>`
//                             chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg"><p class="text-sm font-bold">¿Usted tiene fiebre? (responda si o no)</p></div></div>`
//                             chatInput.value=""
//                             break
//                     case 1: mensaje.push(chatInput.value)
//                             contador += 1
//                             chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end""><div class="bg-blue-600  p-3 rounded-l-lg rounded-br-lg"><p class="text-sm font-bold"> ${chatInput.value} </p></div></div>`
//                             chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg"><p class="text-sm font-bold">¿Usted tiene dolor de cabeza? (responda si o no)</p></div></div>`
//                             chatInput.value=""
//                             break
//                     case 2: mensaje.push(chatInput.value)
//                             contador += 1
//                             chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end""><div class="bg-blue-600  p-3 rounded-l-lg rounded-br-lg"><p class="text-sm font-bold"> ${chatInput.value} </p></div></div>`
//                             chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg"><p class="text-sm font-bold">¿Usted tiene tos? (responda si o no)</p></div></div>`
//                             chatInput.value=""
//                             break
//                     case 3: mensaje.push(chatInput.value)
//                             contador += 1
//                             chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end""><div class="bg-blue-600  p-3 rounded-l-lg rounded-br-lg"><p class="text-sm font-bold"> ${chatInput.value} </p></div></div>`
//                             chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg"><p class="text-sm font-bold">¿Usted siente fatiga? (responda si o no)</p></div></div>`
//                             chatInput.value=""
//                             break
//                     case 4: mensaje.push(chatInput.value)
//                             contador += 1
//                             chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end""><div class="bg-blue-600  p-3 rounded-l-lg rounded-br-lg"><p class="text-sm font-bold"> ${chatInput.value} </p></div></div>`
//                             chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg"><p class="text-sm font-bold">¿Usted tiene dificultad para respirar? (responda si o no)</p></div></div>`
//                             chatInput.value=""
//                             break
//                     case 5: mensaje.push(chatInput.value)
//                             contador += 1
//                             chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end""><div class="bg-blue-600  p-3 rounded-l-lg rounded-br-lg"><p class="text-sm font-bold"> ${chatInput.value} </p></div></div>`
//                             chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg"><p class="text-sm font-bold">¿Usted tiene pérdida del gusto/olfato? (responda si o no)</p></div></div>`
//                             chatInput.value=""
//                             break
//                     case 6: mensaje.push(chatInput.value)
//                             contador += 1
//                             chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end""><div class="bg-blue-600  p-3 rounded-l-lg rounded-br-lg"><p class="text-sm font-bold"> ${chatInput.value} </p></div></div>`
//                             chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg"><p class="text-sm font-bold">¿Usted tiene dolor muscular? (responda si o no)</p></div></div>`
//                             chatInput.value=""
//                             break
//                     case 7: mensaje.push(chatInput.value)
//                             contador += 1
//                             chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end""><div class="bg-blue-600  p-3 rounded-l-lg rounded-br-lg"><p class="text-sm font-bold"> ${chatInput.value} </p></div></div>`
//                             chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg"><p class="text-sm font-bold">¿Usted tuvo conctacto cercano con alguna persona infectada con Covid-19? (responda si o no)</p></div></div>`
//                             chatInput.value=""
//                             break
//                     case 8: mensaje.push(chatInput.value)
//                             contador += 1
//                             chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end""><div class="bg-blue-600  p-3 rounded-l-lg rounded-br-lg"><p class="text-sm font-bold"> ${chatInput.value} </p></div></div>`
//                             chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg"><p class="text-sm font-bold">¿Usted tiene Náuseas/Vómitos? (responda si o no)</p></div></div>`
//                             chatInput.value=""
//                             break
//                     case 9: mensaje.push(chatInput.value)
//                             contador += 1
//                             chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end""><div class="bg-blue-600  p-3 rounded-l-lg rounded-br-lg"><p class="text-sm font-bold"> ${chatInput.value} </p></div></div>`
//                             chat.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-xs"><div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg"><p class="text-sm font-bold">¿Usted tiene Diarrea? (responda si o no)</p></div></div>`
//                             chatInput.value=""
//                             break
//                 }
//             }
//         })
//     })()