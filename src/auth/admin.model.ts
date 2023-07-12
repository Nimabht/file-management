import { compare, genSalt, hash } from 'bcrypt';

export class Admin {
  constructor(public username: string, public password: string) {}

  async validatePassword(password: string): Promise<boolean> {
    // Use bcrypt to compare the hashed password
    return await compare(password, this.password);
  }

  async hashPassword(): Promise<void> {
    const salt = await genSalt();
    this.password = await hash(this.password, salt);
  }
}
