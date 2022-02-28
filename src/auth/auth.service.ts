import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthService {
  signup() {
    return { message: 'Signup works!' }
  }

  signin() {
    return { message: 'Signin works!' }
  }
}
