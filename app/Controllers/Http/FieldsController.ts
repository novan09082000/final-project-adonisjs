import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateFieldValidator from 'App/Validators/CreateFieldValidator'
import Field from 'App/Models/Field'

export default class FieldsController {
    public async store({request,response,params}:HttpContextContract){
        try {
            await request.validate(CreateFieldValidator)
            // let newFieldId = await Database.table('fields').returning('id').insert({
            //     name : request.input('name'),
            //     type: request.input('type'),
            //     venue_id: params.venue_id
            // })
            
            // let field = new Field()
            // field.name = request.input('name')
            // field.type = request.input('type')
            // field.venue_id = parseInt(params.venue_id)
            // await field.save()

            await Field.create({
                name: request.input('name'),
                type: request.input('type'),
                venueId: params.venue_id
            })
            response.created({message: 'created'})
        } catch (error) {
            console.log(error);
            response.unprocessableEntity({errors : error.messages});
        }
    }
    public async index({response,params}:HttpContextContract){
        // let fields = await Database
        // .from('fields')
        // .join('venues', 'venues.id', '=', 'fields.venue_id')
        // .select('fields.*')
        // .select('venues.name as nama_venue','venues.phone','venues.address')
        // .where('fields.venue_id',params.venue_id)
        
        let fields = await Field
        .query()
        .join('venues', 'venues.id', '=', 'fields.venue_id')
        .select('fields.*')
        .select('venues.name as nama_venue','venues.phone','venues.address')
        .where('fields.venue_id',params.venue_id)

        if(fields.length == 0){
            response.badRequest({error: 'venue id yang dicari tidak ada'})
        }else{
            return response.status(200).json({message: 'success get field', data : fields})
        }
        
    }
    public async show({response}:HttpContextContract){
        let field = await Field
        .query().preload('myBooking')
        return response.ok({message: 'success get fields with id', data: field})


    }
    public async update({request,response,params}:HttpContextContract){
        let id = params.id;
        // let affectedRows = await Database.from('fields').where('id',id).update({
        //     name : request.input('name'),
        //     type: request.input('phone'),
        //     venue_id: params.venue_id
        // })

        let field = await Field.findByOrFail('id',id)
            field.name = request.input('name')
            field.type = request.input('type')
            field.venueId =params.venue_id
        field.save()
        return response.ok({message : 'updated!'})
    }
    public async destroy({params,response}:HttpContextContract){
        await Field.query().where('id',params.id).where('venue_id',params.venue_id).delete()
        return response.ok({message : 'deleted'})
    }
}
