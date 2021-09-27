import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Field from './Field'
import User from './User'
import Schedule from './Schedule'

/** 
*  @swagger
*  definitions:
*    CreateBooking:
*      type: object
*      properties:
*        title:
*          type: string
*        play_date_start:
*          type: string
*          format: date-time
*        play_date_end:
*          type: string
*          format: date-time
*      required:
*        - title
*        - play_date_start
*        - play_date_end
*    UpdateBooking:
*      type: object
*      properties:
*        title:
*          type: string
*        play_date_start:
*          type: string
*          format: date-time
*        play_date_end:
*          type: string
*          format: date-time
*/

export default class Booking extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column.dateTime()
  public playDateStart: DateTime

  @column.dateTime()
  public playDateEnd: DateTime

  @column()
  public userId: number

  @column()
  public fieldId: number

  @column()
  public bookingId: number

  @column()
  public scheduleId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Schedule)
  public schedule: HasMany<typeof Schedule>

  @belongsTo(() => Field)
  public field: BelongsTo<typeof Field>

  @belongsTo(() => User)
  public bookingUser: BelongsTo<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'schedules'
  })
  public players: ManyToMany<typeof User>
}
