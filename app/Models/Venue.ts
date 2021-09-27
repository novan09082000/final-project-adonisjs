import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany} from '@ioc:Adonis/Lucid/Orm'

import User from './User'
import Field from './Field'
import Booking from './Booking'

/** 
*  @swagger
*  definitions:
*    CreateVenue:
*      type: object
*      properties:
*        name:
*          type: string
*        phone:
*          type: string
*        address:
*          type: string
*      required:
*        - name
*        - phone
*        - address
*    UpdateVenue:
*      type: object
*      properties:
*        name:
*          type: string
*        phone:
*          type: string
*        address:
*          type: string
*/

export default class Venue extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public address: string

  @column()
  public phone: string

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public author: BelongsTo<typeof User>
  
  @hasMany(() => Field)
  public fields: HasMany<typeof Field>

  @hasMany(() => Booking)
  public bookings: HasMany<typeof Booking>
}
