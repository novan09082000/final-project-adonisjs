import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Booking from 'App/Models/Booking'
import Field from 'App/Models/Field'
import Schedule from 'App/Models/Schedule'


import FormBookingValidator from 'App/Validators/FormBookingValidator'
/**
  * @swagger
  * /api/v1/fields/{field_id}/bookings:
  *     get:
  *       security:
  *         - bearerAuth: []
  *       tags:
  *         - Bookings
  *       parameters:
  *         - name: field_id
  *           description: Id Field
  *           in: path
  *           required: true
  *           type: string
  *       responses:
  *         200:
  *           description: success fetch articles
  *     post:
  *       security:
  *         - bearerAuth: []
  *       tags:
  *         - Bookings
  *       parameters:
  *         - name: field_id
  *           description: Id Field
  *           in: path
  *           required: true
  *           type: string
  *       requestBody:
  *        required: true
  *        content :
  *          application/x-www-form-urlencoded:
  *            schema:
  *             $ref: '#definitions/CreateBooking'
  *          application/json:
  *            schema:
  *             $ref: '#definitions/CreateBooking'
  *       responses:
  *         200:
  *           description: success add booking
  * /api/v1/fields/{field_id}/bookings/{id}:
  *     get:
  *      security:
  *         - bearerAuth: [] 
  *      tags:
  *         - Bookings
  *      parameters:
  *         - name: field_id
  *           description: Id Field
  *           in: path
  *           required: true
  *           type: string
  *         - name: id
  *           description: Id Bookings
  *           in: path
  *           required: true
  *           type: string
  *      responses:
  *        201:
  *          description: success fetch articles
  *     put:
  *      security:
  *         - bearerAuth: [] 
  *      tags:
  *         - Bookings
  *      parameters:
  *         - name: field_id
  *           description: Id Field
  *           in: path
  *           required: true
  *           type: string
  *         - name: id
  *           description: Id Bookings
  *           in: path
  *           required: true
  *           type: string
  *      requestBody:
  *        required: true
  *        content :
  *          application/x-www-form-urlencoded:
  *            schema:
  *             $ref: '#definitions/UpdateBooking'
  *          application/json:
  *            schema:
  *             $ref: '#definitions/UpdateBooking'
  *      responses:
  *        201:
  *          description: updated!
  *     delete:
  *      security:
  *         - bearerAuth: [] 
  *      tags:
  *         - Bookings
  *      parameters:
  *         - name: field_id
  *           description: Id Field
  *           in: path
  *           required: true
  *           type: string
  *         - name: id
  *           description: Id Bookings
  *           in: path
  *           required: true
  *           type: string
  *      responses:
  *        201:
  *          description: deleted!
  * /api/v1/bookings/{id}/join:
  *     put:
  *      tags:
  *        - Bookings
  *      security:
  *        - bearerAuth: [] 
  *      parameters:
  *        - name: id
  *          description: Id Booking
  *          in: path
  *          required: true
  *          type: string
  *      responses:
  *       201:
  *         description: berhasil join booking
  * /api/v1/bookings/{id}/unjoin:
  *     put:
  *      tags:
  *        - Bookings
  *      security:
  *        - bearerAuth: [] 
  *      parameters:
  *        - name: id
  *          description: Id Booking
  *          in: path
  *          required: true
  *          type: string
  *      responses:
  *       201:
  *         description: berhasil unjoin booking
  * /api/v1/schedules:
  *     get:
  *      tags:
  *        - Bookings
  *      security:
  *        - bearerAuth: [] 
  *      responses:
  *       201:
  *         description: berhasil mendapat jadwal
  */


export default class BookingsController {
  public async index ({response}: HttpContextContract) {
    const bookings = await Booking.query().preload('field').preload('bookingUser')
    return response.ok({message: 'success fetch articles', data : bookings})
  }

  public async store ({request,params,response,auth}: HttpContextContract) {
    const field = await Field.findByOrFail('id',params.field_id)
    const user = await auth.user!
    const payload = await request.validate(FormBookingValidator)

    const booking = new Booking()
    booking.playDateStart = payload.play_date_start
    booking.playDateEnd = payload.play_date_end
    booking.title = payload.title
    booking.userId = user.id


    booking.related('field').associate(field)
    
    return response.created({message: 'berhasil booking', data: booking})

  }

  public async show ({response,params}: HttpContextContract) {
    const booking = await Booking.query().select('id','title','play_date_start','play_date_end').where('id',params.id).preload('players', (queryBooking) => queryBooking.select(['id','name','email'])).firstOrFail()
    const player_count = await Booking.query().select('id','title','play_date_start','play_date_end').where('id',params.id).preload('players', (queryBooking) => queryBooking.select(['id','name','email'])).withCount('players').firstOrFail()
    let tampung = {...booking.$original, player_count: player_count.$extras.players_count, ...booking.$preloaded}
    return response.ok({message: 'success fetch articles', data : tampung})
  }

  public async update ({params,request,response}: HttpContextContract) {
    let id = params.id;
        // let affectedRows = await Database.from('fields').where('id',id).update({
        //     name : request.input('name'),
        //     type: request.input('phone'),
        //     venue_id: params.venue_id
        // })

        let booking = await Booking.findByOrFail('id',id)
            booking.title = request.input('title')
            booking.playDateStart = request.input('play_date_start')
            booking.playDateEnd = request.input('play_date_end')
        booking.save()
        return response.ok({message : 'updated!'})
  }

  public async destroy ({params,response}: HttpContextContract) {
    await Booking.query().where('id',params.id).where('field_id',params.field_id).delete()
    return response.ok({message : 'deleted'})
  }

  public async join({response,params,auth}:HttpContextContract){
    const booking = await Booking.findOrFail(params.id)
    let user = auth.user!

    await booking.related('players').sync([user.id],false)
    
    return response.ok({status: "success" , data: "berhasil join booking"})
  }

  public async unjoin({response,params,auth}:HttpContextContract){
    const booking = await Booking.findOrFail(params.id)
    let user = auth.user!
    await booking.related('players').detach([user.id])

    return response.ok({status: "success" , data: "berhasil unjoin booking"})
  }

  public async schedule({response,auth}:HttpContextContract){
    const user = await auth.user?.id
    const user_id = user!
    const schedules = await Schedule.query().preload('myBooking').select('*').where('user_id',user_id)
    return response.ok({message: 'success fetch articles', data : schedules})
  }
}
