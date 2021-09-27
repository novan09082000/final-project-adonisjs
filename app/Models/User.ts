import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Venue from './Venue'
import Booking from './Booking'

/** 
*  @swagger
*  definitions:
*    Register:
*      type: object
*      properties:
*        name:
*          type: string
*        email:
*          type: string
*        password:
*          type: string
*        role:
*          type: string
*      required:
*        - name
*        - email
*        - password
*        - role
*    Otp:
*      type: object
*      properties:
*        email:
*          type: string
*        otp_code:
*          type: number
*      required:
*        - email
*        - otp_code
*    Login:
*      type: object
*      properties:
*        email:
*          type: string
*        password:
*          type: string
*      required:
*        - email
*        - password
*/

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name:string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public role: string

  @column()
  public isVerified: boolean

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @hasMany(() => Venue)
  public venues: HasMany<typeof Venue>

  @hasMany(() => Booking)
  public myBookings: HasMany<typeof Booking>
}
