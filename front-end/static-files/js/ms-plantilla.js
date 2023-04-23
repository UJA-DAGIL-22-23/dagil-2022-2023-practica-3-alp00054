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
                    <tbody>
    `;

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
Plantilla.plantillaTablaPilotos.pie = `        </tbody>
             </table>
             `;

/**
 * Función para mostrar en pantalla todos los nombres de pilotos que se han recuperado de la BBDD.
 * @param {Vector_de_pilotos} vector Vector con los datos de los pilotos a mostrar
 */
//Preguntar
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