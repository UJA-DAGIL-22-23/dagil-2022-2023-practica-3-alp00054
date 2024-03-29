/**
 * @file Plantilla.js
 * @description Funciones para el procesamiento de la info enviada por el MS Plantilla
 * @author Víctor M. Rivas <vrivas@ujaen.es>
 * @date 03-feb-2023
 */

"use strict";

/// Creo el espacio de nombres
let Plantilla = {};

// Plantilla de datosDescargados vacíos
Plantilla.datosDescargadosNulos = {
    mensaje: "Datos Descargados No válidos",
    autor: "",
    email: "",
    fecha: ""
}


/**
 * Función que descarga la info MS Plantilla al llamar a una de sus rutas
 * @param {string} ruta Ruta a descargar
 * @param {función} callBackFn Función a la que se llamará una vez recibidos los datos.
 */
Plantilla.descargarRuta = async function (ruta, callBackFn) {
    let response = null

    // Intento conectar con el microservicio Plantilla
    try {
        const url = Frontend.API_GATEWAY + ruta
        response = await fetch(url)

    } catch (error) {
        alert("Error: No se han podido acceder al API Gateway")
        console.error(error)
        //throw error
    }

    // Muestro la info que se han descargado
    let datosDescargados = null
    if (response) {
        datosDescargados = await response.json()
        callBackFn(datosDescargados)
    }
}


/**
 * Función principal para mostrar los datos enviados por la ruta "home" de MS Plantilla
 */
Plantilla.mostrarHome = function (datosDescargados) {
    // Si no se ha proporcionado valor para datosDescargados
    datosDescargados = datosDescargados || this.datosDescargadosNulos

    // Si datos descargados NO es un objeto 
    if (typeof datosDescargados !== "object") datosDescargados = this.datosDescargadosNulos

    // Si datos descargados NO contiene el campo mensaje
    if (typeof datosDescargados.mensaje === "undefined") datosDescargados = this.datosDescargadosNulos

    Frontend.Article.actualizar("Plantilla Home", datosDescargados.mensaje)
}

/**
 * Función principal para mostrar los datos enviados por la ruta "acerca de" de MS Plantilla
 */
Plantilla.mostrarAcercaDe = function (datosDescargados) {
    // Si no se ha proporcionado valor para datosDescargados
    datosDescargados = datosDescargados || this.datosDescargadosNulos

    // Si datos descargados NO es un objeto 
    if (typeof datosDescargados !== "object") datosDescargados = this.datosDescargadosNulos

    // Si datos descargados NO contiene los campos mensaje, autor, o email
    if (typeof datosDescargados.mensaje === "undefined" ||
        typeof datosDescargados.autor === "undefined" ||
        typeof datosDescargados.email === "undefined" ||
        typeof datosDescargados.fecha === "undefined"
    ) datosDescargados = this.datosDescargadosNulos

    const mensajeAMostrar = `<div>
    <p>${datosDescargados.mensaje}</p>
    <ul>
        <li><b>Autor/a</b>: ${datosDescargados.autor}</li>
        <li><b>E-mail</b>: ${datosDescargados.email}</li>
        <li><b>Fecha</b>: ${datosDescargados.fecha}</li>
    </ul>
    </div>
    `;
    Frontend.Article.actualizar("Plantilla Acerca de", mensajeAMostrar)
}

/**
 * Función que recuperar todos los pilotos llamando al MS Plantilla
 * @param {función} callBackFn Función a la que se llamará una vez recibidos los datos.
 */

Plantilla.recupera = async function (callBackFn) {
    let response = null

    // Intento conectar con el microservicio 
    try {
        const url = Frontend.API_GATEWAY + "/plantilla/get_pilotos"
        response = await fetch(url)

    } catch (error) {
        alert("Error: No se han podido acceder al API Gateway")
        console.error(error)
        //throw error
    }

    // Muestro todos los pilotos que se han descargado
    let vectorPilotos = null
    if (response) {
        vectorPilotos = await response.json()
        callBackFn(vectorPilotos.data)
    }
}

/**
 * Función principal para responder al evento de elegir la opción "Home"
 */
Plantilla.procesarHome = function () {
    this.descargarRuta("/plantilla/", this.mostrarHome);
}

/**
 * Función principal para responder al evento de elegir la opción "Acerca de"
 */
Plantilla.procesarAcercaDe = function () {
    this.descargarRuta("/plantilla/acercade", this.mostrarAcercaDe);
}

/**
 * Actualiza el cuerpo de la plantilla deseada con los datos del piloto que se le pasa
 * @param {String} plantilla Cadena conteniendo HTML en la que se desea cambiar lso campos de la plantilla por datos
 * @param {Plantilla} piloto Objeto con los datos del piloto que queremos escribir en el TR
 * @returns La plantilla del cuerpo de la tabla con los datos actualizados 
 */ 
Plantilla.sustituyeTags = function (plantilla, piloto) {
    return plantilla
        .replace(new RegExp(Plantilla.plantillaTags.nombre, 'g'), piloto.data.nombre)
        .replace(new RegExp(Plantilla.plantillaTags.apellido, 'g'), piloto.data.apellido)
}

// Tags que voy a usar para sustituir los campos
Plantilla.plantillaTags = {
    "nombre": "### nombre ###",
    "apellido": "### apellido ###",
    "edad": "### edad ###",
    "motos": "### motos ###",
    "playasvisitadas": "### playasvisitadas ###",
}

/// Plantilla para poner los datos de varios pilotos dentro de una tabla
Plantilla.plantillaTablaPilotos = {}

// Cabecera de la tabla de pilotos
Plantilla.plantillaTablaPilotos.cabecera = `<table width="100%" class="listado-personas">
                    <thead>
                        <th width="20%">Nombre</th>
                        <th width="20%">Apellidos</th>
                    </thead>
                    <tbody>`;

// Elemento TR que muestra los nombres y apellidos de los pilotos
Plantilla.plantillaTablaPilotos.cuerpo = `
    <tr title="${Plantilla.plantillaTags.nombre}">
        <td>${Plantilla.plantillaTags.nombre}</td>
        <td>${Plantilla.plantillaTags.apellido}</td>
        <td>
                    <div></div>
        </td>
    </tr>
    `;

// Pie de la tabla
Plantilla.plantillaTablaPilotos.pie = `</tbody></table>`;

/**
 * Función para mostrar en pantalla todos los nombres de pilotos que se han recuperado de la BBDD.
 * @param {Vector_de_pilotos} vector Vector con los datos de los pilotos a mostrar
 */

Plantilla.imprimenombres = function (vector) {
    let msj = Plantilla.plantillaTablaPilotos.cabecera
    if (vector && Array.isArray(vector)) {
        vector.forEach(e => msj += Plantilla.plantillaTablaPilotos.actualizapiloto(e));
    }
    msj += Plantilla.plantillaTablaPilotos.pie

    Frontend.Article.actualizar("Nombres de los pilotos", msj)
}

/**
 * Actualiza el formulario con los datos del piloto que se le pasa
 * @param {Plantilla} Plantilla Objeto con los datos del piloto que queremos escribir en el TR
 * @returns La plantilla del cuerpo de la tabla con los datos actualizados 
 */
Plantilla.plantillaTablaPilotos.actualizapiloto = function (piloto) {
    return Plantilla.sustituyeTags(this.cuerpo, piloto)
}

/**
 * Función principal para recuperar los pilotos desde el MS y, posteriormente, imprimirlos.
 */
Plantilla.procesarlistado = function () {
    Plantilla.recupera(Plantilla.imprimenombres);
}

/**
 * Función que recuperar todos los pilotos llamando al MS Plantilla
 * @param {función} callBackFn Función a la que se llamará una vez recibidos los datos.
 */

Plantilla.recuperacom = async function (callBackFn) {
    let response = null

    // Intento conectar con el microservicio 
    try {
        const url = Frontend.API_GATEWAY + "/plantilla/get_pilotos_completos"
        response = await fetch(url)

    } catch (error) {
        alert("Error: No se han podido acceder al API Gateway")
        console.error(error)
        //throw error
    }

    // Muestro todos los pilotos que se han descargado
    let vectorPilotos = null
    if (response) {
        vectorPilotos = await response.json()
        callBackFn(vectorPilotos.data)
    }
}

/**
 * Actualiza el cuerpo de la plantilla deseada con los datos del piloto que se le pasa
 * @param {String} plantilla Cadena conteniendo HTML en la que se desea cambiar los campos de la plantilla por datos
 * @param {Plantilla} piloto Objeto con los datos del piloto que queremos escribir en el TR
 * @returns La plantilla del cuerpo de la tabla con los datos actualizados 
 */ 
Plantilla.sustituyeTagscompleto = function (plantilla, piloto) {
    return plantilla
        .replace(new RegExp(Plantilla.plantillaTags.nombre, 'g'), piloto.data.nombre)
        .replace(new RegExp(Plantilla.plantillaTags.apellido, 'g'), piloto.data.apellido)
        .replace(new RegExp(Plantilla.plantillaTags.edad, 'g'), piloto.data.edad)
        .replace(new RegExp(Plantilla.plantillaTags.motos, 'g'), piloto.data.motos.nombre+"/"
        +piloto.data.motos.plazas+"/"+piloto.data.motos.peso)
        .replace(new RegExp(Plantilla.plantillaTags["playasvisitadas"], 'g'), piloto.data.playasvisitadas)
}

/// Plantilla para poner los datos de varios pilotos dentro de una tabla
Plantilla.plantillaTablaPilotoscom = {}

// Cabecera de la tabla de pilotos
Plantilla.plantillaTablaPilotoscom.cabecera = `<table width="100%" class="listado-personas">
                    <thead>
                        <th width="20%">Nombre</th>
                        <th width="20%">Apellidos</th>
                        <th width="20%">Edad</th>
                        <th width="20%">Motos</th>
                        <th width="20%">Playas visitadas</th>
                    </thead>
                    <tbody>`;

// Elemento TR que muestra los datos de los pilotos
Plantilla.plantillaTablaPilotoscom.cuerpo = `
    <tr title="${Plantilla.plantillaTags.nombre}">
        <td>${Plantilla.plantillaTags.nombre}</td>
        <td>${Plantilla.plantillaTags.apellido}</td>
        <td>${Plantilla.plantillaTags.edad}</td>
        <td>${Plantilla.plantillaTags.motos}</td>
        <td>${Plantilla.plantillaTags["playasvisitadas"]}</td>
        <td><div></div>
        </td>
    </tr>
    `;

// Pie de la tabla
Plantilla.plantillaTablaPilotoscom.pie = `</tbody>
</table>`;

/**
 * Actualiza el formulario con los datos del piloto que se le pasa
 * @param {Plantilla} Plantilla Objeto con los datos del piloto que queremos escribir en el TR
 * @returns La plantilla del cuerpo de la tabla con los datos actualizados 
 */

Plantilla.plantillaTablaPilotoscom.actualizapilotocom = function (piloto) {
    return Plantilla.sustituyeTagscompleto(this.cuerpo, piloto)
}


/**
 * Función para mostrar en pantalla todos los datos de pilotos que se han recuperado de la BBDD.
 * @param {Vector_de_pilotos} vector Vector con los datos de los pilotos a mostrar
 */

Plantilla.imprimenombrescompleto = function (vector) {
    let msj = Plantilla.plantillaTablaPilotoscom.cabecera
    if (vector && Array.isArray(vector)) {
        vector.forEach(e => msj += Plantilla.plantillaTablaPilotoscom.actualizapilotocom(e));
    }
    msj += Plantilla.plantillaTablaPilotoscom.pie

    Frontend.Article.actualizar("Datos de los pilotos", msj)
}


/**
 * Función principal para recuperar los pilotos desde el MS y, posteriormente, imprimirlos.
 */
Plantilla.procesarlistadocompleto = function () {
    Plantilla.recuperacom(Plantilla.imprimenombrescompleto);
}

/**
 * Función que imprime todos los datos de todos los pilotos ordenados alfabéticamente
 * @param {Vector_de_pilotos} vector 
 */
Plantilla.imprimeorden = function(vector) {
    // Compongo el contenido que se va a mostrar dentro de la tabla
    let msj = Plantilla.plantillaTablaPilotos.cabecera
    if (vector && Array.isArray(vector)) {
        vector.sort(function(a, b) {
            let nombreA = a.data.nombre.toUpperCase(); 
            let nombreB = b.data.nombre.toUpperCase(); 
            if (nombreA > nombreB) {
                return 1;
            }
            if (nombreA < nombreB) {
                return -1;
            }
            return 0;
        });

        vector.forEach(e => msj += Plantilla.plantillaTablaPilotos.actualizapiloto(e));
    }
    msj += Plantilla.plantillaTablaPilotos.pie

    // Borrar toda la información del Article y la sustituyo por la que ma interesa
    Frontend.Article.actualizar("Nombres en orden", msj)
}


/**
 * Función principal para recuperar los pilotos desde el MS y, posteriormente, ordenarlos.
 */
Plantilla.ordenarlistado = function () {
    Plantilla.recupera(Plantilla.imprimeorden);
}

/**
 * Función que recuperar pilotos por nombre.
 * @param {función} callBackFn Función a la que se llamará una vez recibidos los datos.
 */
Plantilla.recuperanombre = async function (callBackFn,nombre) {
    let response = null

    // Intento conectar con el microservicio 
    try {
        const url = Frontend.API_GATEWAY + "/plantilla/get_pilotos_completos"
        response = await fetch(url)

    } catch (error) {
        alert("Error: No se han podido acceder al API Gateway")
        console.error(error)
        //throw error
    }

    // Muestro todos los pilotos que se han descargado
    let vectorPilotos = null
    if (response) {
        vectorPilotos = await response.json()
        const filtro = vectorPilotos.data.filter(piloto => piloto.data.nombre === nombre)
        callBackFn(filtro)
    }
}

/**
 * Función principal para encontrar piloto por nombre.
 */
Plantilla.busquedaporNombre = function (nombre) {
    Plantilla.recuperanombre(Plantilla.imprimenombrescompleto,nombre);
}

/**
 * Función que recupera todos los pilotos llamando al MS Plantilla
 * Posteriormente, llama a la función callBackFn para trabajar con los datos recuperados.
 * @param {string} criterio1 El primer criterio que se busca
 * @param {string} criterio2 El segundo criterio que se busca
 * @param {string} criterio3 El tercer criterio que se busca
 * @param {funcion} callBackFn Función a la que se llamará una vez recibidos los datos
 */
Plantilla.Buscaporcrit = async function (criterio1, criterio2, criterio3, tipo, callBackFn) {
    try {
        const url = Frontend.API_GATEWAY + "/plantilla/get_pilotos_completos"
        const response = await fetch(url);
        let vectorPilotos = null
        if (response) {
            vectorPilotos = await response.json()
            if(tipo){
                const filtro = vectorPilotos.data.filter(piloto => piloto.data.nombre === criterio1 || piloto.data.apellido === criterio2 || piloto.data.edad === parseInt(criterio3))
                callBackFn(filtro)    
            }else{
            const filtro = vectorPilotos.data.filter(piloto => piloto.data.nombre === criterio1 && piloto.data.apellido === criterio2 && piloto.data.edad === parseInt(criterio3))
            callBackFn(filtro)}
        }
    } catch (error) {
        alert("Error: No se han podido acceder al API Geteway")
        console.error(error)
    }
}


/**
 * Función principal para encontrar piloto por criterios
 * @param {string} crit1 El primer criterio que se busca
 * @param {string} crit2 El segundo criterio que se busca
 * @param {string} crit3 El tercer criterio que se busca
 * @param {bool} tipo Tipo de busqueda a realizar
 */
Plantilla.buscaCriterio = function (crit1, crit2, crit3, tipo) {
    this.Buscaporcrit(crit1, crit2, crit3, tipo, this.imprimenombrescompleto); 
}