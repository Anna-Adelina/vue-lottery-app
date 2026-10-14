import { UserService } from './user.service'

export class ServiceProvider {
  private static userService?: UserService

  static get users(): UserService {
    this.userService ??= new UserService()
    return this.userService
  }
}