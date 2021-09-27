// import Venue from './Venue'
import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column, HasMany, hasMany} from '@ioc:Adonis/Lucid/Orm'

import Venue from './Venue'
import Booking from './Booking'

export default class Field extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public type: string

  // @hasMany(() => Venue,{
  //   foreignKey: 'id'
  // })
  // public venue_id: HasMany<typeof Venue>

  @column()
  public venueId: number

  @column()
  public bookingId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Venue)
  public author: BelongsTo<typeof Venue>

  @hasMany(() => Booking)
  public myBooking: HasMany<typeof Booking>
}
