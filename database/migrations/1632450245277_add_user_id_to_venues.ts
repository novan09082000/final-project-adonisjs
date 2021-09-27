import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Venue extends BaseSchema {
  protected tableName = 'venues'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')    
    })
    
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropForeign('user_id')
      table.dropColumn('user_id')
    })
  }
}
