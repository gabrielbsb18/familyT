const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

const Trip = require('../../models/trip.model');

describe('Pruebas sobre la API de trips', () =>{

    beforeAll(async () => {
        await mongoose.connect('mongodb://127.0.0.1/familytrips');

    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('GET /api/trips', () => {

        let response;
        beforeEach(async () => {
            response = await request(app).get('/api/trips').send();
        });

        it('A rota funciona', async () => {
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        });

        it('La peticion nos devolve um array de trips', async () => {
            expect(response.body).toBeInstanceOf(Array);
            

          
        });

    });

    describe('POST /api/trips', () => {

        const newTrip = { name: 'test trip', destination: 'Berlim', 
        category: 'familiar', start_date: '2022-06-20' };
        const wrongTrip = { nombre: 'test trip'};

        afterAll(async () => {
            await Trip.deleteMany({ name: 'teste trip'})
        })


        it('la ruta funcione', async () => {
            const response = await request(app).post('/api/trips').send(newTrip);

            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        });

        it('Se inserta corretamente', async () => {
            const response = await request(app).post('/api/trips').send(newTrip);

            expect(response.body._id).toBeDefined();
            expect(response.body.name).toBe(newTrip.name);

        });

        it('Error em la insercion', async () => {
            const response = await request(app).post('/api/trips').send(wrongTrip);

            expect(response.status).toBe(500);
            expect(response.body.error).toBeDefined();
        });
    });

    describe('PUT /api/trips', () => {

        let trip;
        beforeEach( async() => {
            trip = await Trip.create({ name: 'test trip', destination: 'Berlin', 
            category:'amigos', start_date: '2022-06-07' });

        });

        afterEach(async () => {
            await Trip.findByIdAndDelete(trip._id);

        });

        it('La ruta funciona', async () => {
            const response = await request(app).put(`/api/trips/${trip._id}`).send({
                name: 'trip updated'
            });

            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        });

        it('Se actualiza correctamente', async () => {
            const response = await request(app).put(`/api/trips/${trip._id}`).send({
                name: 'trip updated'
            });

            expect(response.body._id).toBeDefined();
            expect(response.body.name).toBe('trip updated');
        });


    });

    describe('DELETE /api/trips', () => {

        let trip;
        let response;
        beforeEach(async () => {
            trip = await Trip.create({ name: 'test trip', destination: 'Berlín', category: 'amigos', start_date: '2022-06-07' });
            response = await request(app).delete(`/api/trips/${trip._id}`).send();
        });

        it('La ruta funciona', () => {
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        });

        it('Borra correctamente', async () => {
            expect(response.body._id).toBeDefined();

            const foundTrip = await Trip.findById(trip._id);
            expect(foundTrip).toBeNull();
        })

    });
});