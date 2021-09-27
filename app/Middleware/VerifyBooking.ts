import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class VerifyBooking {
  public async handle ({auth, response}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    let isVerified = auth.user?.isVerified
    let role = auth.user?.role
    if(isVerified){
      if(role == 'user' || role == 'admin'){
        await next()
      }else{
        return response.unauthorized({message: 'tidak terverifikasi karena bukan user ataupun admin'})
      }
    }else{
      return response.unauthorized({message: 'anda belum terverifikasi'})
    }
    
  }
}
