import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminLoginDto } from './adminLogin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() adminLoginDto: AdminLoginDto,
  ): Promise<{ token: string }> {
    const { username, password } = adminLoginDto;
    const admin = await this.authService.validateAdmin(username, password);

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.authService.generateToken(admin);
    return { token };
  }
}
