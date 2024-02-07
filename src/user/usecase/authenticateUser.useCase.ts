import { User } from '../entities/user.entity';
import { UserRepository } from '../repository/user.repository';

export class AuthenticateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByUsername(username);
    if (user && user.password === this.hashPassword(password)) {
      return user;
    }
    return null;
  }

  private hashPassword(password: string): string {
    return password;
  }
}
