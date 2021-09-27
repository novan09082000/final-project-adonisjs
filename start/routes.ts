/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'


Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  // Authentication
  Route.post('/register','AuthController.register').as('auth.register')
  Route.post('/login','AuthController.login').as('auth.login')
  Route.post('/otp-confirmation','AuthController.otp_verification').as('auth.verify')
  // Venues
  Route.get('/venues','VenuesController.index').as('venues.index').middleware(['auth','verifyVenue'])
  Route.post('/venues','VenuesController.store').as('venues.store').middleware(['auth','verifyVenue'])
  Route.get('/venues/:id','VenuesController.show').as('venues.show').middleware(['auth','verifyVenue'])
  Route.put('/venues/:id','VenuesController.update').as('venues.update').middleware(['auth','verifyVenue'])
  Route.delete('/venues/:id','VenuesController.destroy').as('venues.destroy').middleware(['auth','verifyVenue'])
  // booking
  Route.resource('venues.fields','FieldsController').apiOnly().middleware({'*' : ['auth','verifyField']})
  Route.resource('fields.bookings','BookingsController').apiOnly().middleware({'*' : ['auth','verifyBooking']})
  Route.put('/bookings/:id/join','BookingsController.join').as('Booking.join').middleware(['auth','verifyBooking'])
  Route.put('/bookings/:id/unjoin','BookingsController.unjoin').as('Booking.unjoin').middleware(['auth','verifyBooking'])
  Route.get('/schedules','BookingsController.schedule').as('Booking.schedule').middleware(['auth','verifyBooking'])
}).prefix('api/v1')
// Route.post('/bookings','BookingsController.store').as('booking.store')