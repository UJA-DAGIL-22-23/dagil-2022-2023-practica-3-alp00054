/**
 * @file routes.js
 * @description Define las rutas ante las que va a responder al MS Plantilla
 * @author Víctor M. Rivas <vrivas@ujaen.es>
 * @date 03-feb-2023
 */

const express = require("express");
const router = express.Router();
const { callbacks } = require("./callbacks");



/**
 * Ruta raíz: /
 */
router.get("/", async (req, res) => {
    try {
        await callbacks.home(req, res)
    } catch (error) {
        console.log(error);
    }
});

/**
 * Ruta Acerca De (es decir, About...)
 */
router.get("/acercade", async (req, res) => {
    try {
        await callbacks.acercaDe(req, res)
    } catch (error) {
        console.log(error);
    }
});



/**
 * Test de conexión a la BBDD
 */
router.get("/test_db", async (req, res) => {
    try {
        await callbacks.test_db(req, res)
    } catch (error) {
        console.log(error);
    }
});

/**
 * Ruta de get_pilotos
 */
router.get("/get_pilotos", async (req, res) => {
    try {
        await callbacks.get_pilotos(req, res)
    } catch (error) {
        console.log(error);
    }
});

/**
 * Ruta de get_pilotos completa
 */
router.get("/get_pilotos_completos", async (req, res) => {
    try {
        await callbacks.get_pilotos_completos(req, res)
    } catch (error) {
        console.log(error);
    }
});

/**
 * Ruta de get_pilotos ordenados
 */
router.get("get_pilotos_ordenados", async (req, res) => {
    try {
        await callbacks.get_pilotos_ordenados(req, res)
    } catch (error) {
        console.log(error);
    }
});

// Exporto el módulo para poder usarlo en server
module.exports = router;
