import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Admin } from './admin.model';

@Injectable()
export class AuthService {
  private adminUser: Admin;
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.initializeAdmin();
  }

  private async initializeAdmin(): Promise<void> {
    this.adminUser = new Admin(
      process.env.ADMIN_USERNAME,
      process.env.ADMIN_PASSWORD,
    );
    await this.adminUser.hashPassword();
  }
}
