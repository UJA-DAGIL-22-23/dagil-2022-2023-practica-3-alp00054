/**
 * @file server-spec.js
 * @description Fichero con la especificación de las pruebas TDD para server.js del MS MS Plantilla
 *              Este fichero DEBE llamarse server-spec.js
 *              Este fichero DEBE ubicarse en el subdirectorio spec/
 * @author Víctor M. Rivas Santos <vrivas@ujaen.es>
 * @date 03-Feb-2023
 */


const supertest = require('supertest');
const assert = require('assert')
const app = require('../server');

/**
 * Test para las rutas "estáticas": / y /acerdade
 */
describe('Servidor PLANTILLA:', () => {
  describe('Rutas / y /acercade', () => {
    it('Devuelve MS Plantilla Home Page', (done) => {
      supertest(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function (res) {
          //console.log( res.body ); // Para comprobar qué contiene exactamente res.body
          assert(res.body.hasOwnProperty('mensaje'));
          assert(res.body.mensaje === "Microservicio MS Plantilla: home");

        })
        .end((error) => { error ? done.fail(error) : done() })
    });
    it('Devuelve MS Plantilla Acerca De', (done) => {
      supertest(app)
        .get('/acercade')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function (res) {
          //console.log( "BODY ACERCA DE ", res.body ); // Para comprobar qué contiene exactamente res.body
          assert(res.body.hasOwnProperty('mensaje'));
          assert(res.body.mensaje === "Microservicio MS Plantilla: acerca de");
          assert(res.body.autor == "Ana León Pulido");
          assert(res.body.email == "alp00054@red.ujaen.es");
          assert(res.body.fecha == "18-04-2023");
        })
        .end((error) => { error ? done.fail(error) : done() })
    });
  })

  /**
   * Tests para acceso a la BBDD
   */
  describe('Acceso a BBDD:', () => {
    it('Devuelve nombre al consultar mediante test_db', (done) => {
      supertest(app)
        .get('/test_db')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function (res) {
          //console.log( res.body ); // Para comprobar qué contiene exactamente res.body
          assert(res.body.data[0].data.hasOwnProperty('nombre'));
          assert(res.body.data[0].data.nombre === "Ana");

        })
        .end((error) => { error ? done.fail(error) : done(); }
        );
    });

  })

  /**
   * Listar pilotos
   */
  describe('Lista de pilotos:', () => {
    it('Devuelve un listado con todos los pilotos', (done) => {
      supertest(app)
        .get('/get_pilotos')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function (res) {
          //console.log( res.body ); // Para comprobar qué contiene exactamente res.body
          assert(res.body.data[0].data.hasOwnProperty('nombre'));
          assert(res.body.data[0].data.hasOwnProperty('apellido'));
          assert(res.body.data[0].data.nombre === "Ana");
          assert(res.body.data[0].data.nombre != "Pato");
          assert(res.body.data.length === 10);
        })
        .end((error) => { error ? done.fail(error) : done(); }
        );
    });

  })

  /**
   * Listar pilotos completo
   */
  describe('Lista de pilotos completa:', () => {
    it('Devuelve un listado con todos los pilotos', (done) => {
      supertest(app)
        .get('/get_pilotos_completos')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function (res) {
          //console.log( res.body ); // Para comprobar qué contiene exactamente res.body
          assert(res.body.data[0].data.hasOwnProperty('nombre'));
          assert(res.body.data[0].data.hasOwnProperty('apellido'));
          assert(res.body.data[0].data.hasOwnProperty('edad'));
          assert(res.body.data[0].data.hasOwnProperty('motos'));
          assert(res.body.data[0].data.hasOwnProperty('playasvisitadas'));
          assert(res.body.data[0].data.nombre === "Ana");
          assert(res.body.data[0].data.nombre != "Pato");
          assert(res.body.data.length === 10);
        })
        .end((error) => { error ? done.fail(error) : done(); }
        );
    });

  })

  /**
   * Tests para acceso a la BBDD
   */
  describe('Acceso a BBDD:', () => {
    it('Devuelve nombre al consultar mediante test_db', (done) => {
      supertest(app)
        .get('/test_db')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function (res) {
          //console.log( res.body ); // Para comprobar qué contiene exactamente res.body
          assert(res.body.data[0].data.hasOwnProperty('nombre'));
          assert(res.body.data[0].data.nombre === "Ana");

        })
        .end((error) => { error ? done.fail(error) : done(); }
        );
    });

  })

  /**
   * Listar pilotos
   */
  describe('Lista de pilotos:', () => {
    it('Devuelve un listado con todos los pilotos', (done) => {
      supertest(app)
        .get('/get_pilotos')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function (res) {
          //console.log( res.body ); // Para comprobar qué contiene exactamente res.body
          assert(res.body.data[0].data.hasOwnProperty('nombre'));
          assert(res.body.data[0].data.hasOwnProperty('apellido'));
          assert(res.body.data[0].data.nombre === "Ana");
          assert(res.body.data[0].data.nombre != "Pato");
          assert(res.body.data.length === 10);
        })
        .end((error) => { error ? done.fail(error) : done(); }
        );
    });

  })

  /**
   * Listar pilotos completo
   */
  describe('Lista de pilotos completa:', () => {
    it('Devuelve un listado con todos los pilotos', (done) => {
      supertest(app)
        .get('/get_pilotos_completos')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function (res) {
          //console.log( res.body ); // Para comprobar qué contiene exactamente res.body
          assert(res.body.data[0].data.hasOwnProperty('nombre'));
          assert(res.body.data[0].data.hasOwnProperty('apellido'));
          assert(res.body.data[0].data.hasOwnProperty('edad'));
          assert(res.body.data[0].data.hasOwnProperty('motos'));
          assert(res.body.data[0].data.hasOwnProperty('playasvisitadas'));
          assert(res.body.data[0].data.nombre === "Ana");
          assert(res.body.data[0].data.nombre != "Pato");
          assert(res.body.data.length === 10);
        })
        .end((error) => { error ? done.fail(error) : done(); }
        );
    });

  })

});



