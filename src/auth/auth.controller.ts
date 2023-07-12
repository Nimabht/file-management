import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminLoginDto } from './adminLogin.dto';
import {
  ApiBadRequestResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger/dist';

@ApiTags('َAdmin authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 200,
    description: 'Admin logged in successfully',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized (Invalid credentials)',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad inputs in body.',
  })
  @Post('login')
  @HttpCode(200)
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
