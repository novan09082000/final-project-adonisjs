import { schema , rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateVenueValidator {
  constructor (protected ctx: HttpContextContract) {
  }

	/*
	 * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
	 *
	 * For example:
	 * 1. The username must be of data type string. But then also, it should
	 *    not contain special characters or numbers.
	 *    ```
	 *     schema.string({}, [ rules.alpha() ])
	 *    ```
	 *
	 * 2. The email must be of data type string, formatted as a valid
	 *    email. But also, not used by any other user.
	 *    ```
	 *     schema.string({}, [
	 *       rules.email(),
	 *       rules.unique({ table: 'users', column: 'email' }),
	 *     ])
	 *    ```
	 */
  public schema = schema.create({
	  name: schema.string({},[
		  rules.minLength(2),
		  rules.alpha({allow: ['space', 'underscore', 'dash']})
	  ]),
	  address: schema.string({},[
		  rules.maxLength(150)
	  ]),
	  phone: schema.string({},[
		  rules.mobile({
			  locales : ['id-ID']
		  }),
		  rules.minLength(10)
	  ])
  })

	/**
	 * Custom messages for validation failures. You can make use of dot notation `(.)`
	 * for targeting nested fields and array expressions `(*)` for targeting all
	 * children of an array. For example:
	 *
	 * {
	 *   'profile.username.required': 'Username is required',
	 *   'scores.*.number': 'Define scores as valid numbers'
	 * }
	 *
	 */
  public messages = {
	'nama.alpha': 'nama bukan alphabetic',
	'nama.minLength': 'digit nama kurang dari 2',
	'phone.mobile': 'nomor bukan asal indonesia',
	'phone.minLength': 'digit nomor terlalu sedikit'
  }
}
