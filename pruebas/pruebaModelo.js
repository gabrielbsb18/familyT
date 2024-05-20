const mongoose = require('mongoose');
const Trip = require('./models/trip.model');

(async () => {
    await mongoose.connect('mongodb://127.0.0.1/familytrips');
    

    const newTrip = await Trip.create({
        name: 'prueba de viaje',
        description: 'prueba de desc',
        destination: 'Berlim',
        category: 'amigos',
        start_date:'2022-05-02'
    });
    console.log(newTrip);
})();