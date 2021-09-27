import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import UserValidator from 'App/Validators/UserValidator'
import Mail from '@ioc:Adonis/Addons/Mail'
import Database from '@ioc:Adonis/Lucid/Database'

export default class AuthController {
/**
  * @swagger
  * /api/v1/register:
  *     post:
  *       tags:
  *         - Authentication
  *       requestBody:
  *         required: true
  *         content :
  *           application/x-www-form-urlencoded:
  *             schema:
  *               $ref: '#definitions/Register'
  *           application/json:
  *             schema:
  *               $ref: '#definitions/Register'
  *       responses:
  *         200:
  *           description: user created, verify otp in email
  * /api/v1/otp-confirmation :
  *     post:
  *      tags:
  *        - Authentication
  *      requestBody:
  *        required: true
  *        content :
  *          application/x-www-form-urlencoded:
  *            schema:
  *             $ref: '#definitions/Otp'
  *          application/json:
  *            schema:
  *             $ref: '#definitions/Otp'
  *      responses:
  *        200:
  *          description: verification successed
  * /api/v1/login:
  *     post:
  *      tags:
  *        - Authentication
  *      requestBody:
  *        required: true
  *        content :
  *          application/x-www-form-urlencoded:
  *            schema:
  *             $ref: '#definitions/Login'
  *          application/json:
  *            schema:
  *             $ref: '#definitions/Login'
  *      responses:
  *        200:
  *          description: login success
  */

    public async register({request,response}:HttpContextContract){
        try {
            const payload = await request.validate(UserValidator)

            const newUser = await User.create({
                name: payload.name,
                password: payload.password,
                email: payload.email,
                role: payload.role
            })

            let otp_code = Math.floor(100000 + Math.random() * 900000)
            await Database.table('otp_codes').insert({otp_code: otp_code, user_id: newUser.id})
            await Mail.send((message) => {
                message
                  .from('admin@todoapi.com')
                  .to(payload.email)
                  .subject('Welcome Onboard!')
                  .htmlView('mail/otp_verification', { name: payload.name, otp_code: otp_code})
              })
            return response.created({message: 'silahakan melakukan verifikasi OTP',data: newUser,})
        } catch (error) {
            console.log(error);
            return response.unprocessableEntity({message: error.messages})
        }
    }
    public async login({request,response, auth}:HttpContextContract){
        const useSchema = schema.create({
            email: schema.string(),
            password: schema.string()
        })
        try {

            await request.validate({schema: useSchema})
            const email = request.input('email')
            const password = request.input('password')
            const token = await auth.use('api').attempt(email,password)
            return response.ok({message: 'login success', token})
        } catch (error) {
            if(error.guard){
                return response.badRequest({message: 'login error', error: error.message})
            }else{
                return response.badRequest({message: 'login error', error: error.messages})
            }
        }
    }
    public async otp_verification({request,response}:HttpContextContract){
        const otp_code = request.input('otp_code')
        const email = request.input('email')

        const user = await User.findByOrFail('email',email)
        const dataOtp = await Database.from('otp_codes').where('otp_code', otp_code).firstOrFail()
        if(user.id == dataOtp.user_id){
            user.isVerified = true
            await user.save()
            return response.ok({status: 'success', data: 'verification successed'})
        }else{
            return response.badRequest({status: 'error', data: 'OTP verification failed'})
        }
        // const data = await Database.table('otp_codes').where('otp_code')
    }
}
