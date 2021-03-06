import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Profile } from './entities/profile.entity';
import { AuthorizationGuard } from '../auth/guard/authorization.guard';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // get all users-profiles on server
  @Get()
  @UseGuards(AuthorizationGuard)
  @ApiTags('Profile')
  findAll() {
    return this.profileService.findAll();
  }

  @Get('get/email')
  @ApiTags('Profile')
  @UseGuards(AuthorizationGuard)
  async findByEmail(@Body('email') email: string) {
    return await this.profileService.findByEmail(email);
  }

  @Get('current')
  @UseGuards(AuthorizationGuard)
  getCurrent(@Request() req: any) {
    const profile: Profile = req.profile;
    return profile;
  }

  // get one user-profile by its userId
  @Get(':id')
  @ApiTags('Profile')
  @UseGuards(AuthorizationGuard)
  findOne(@Param('id') id: string) {
    return this.profileService.findById(id);
  }

  // update the profile of signed in user
  @Patch()
  @UseGuards(AuthorizationGuard)
  @ApiTags('Profile')
  update(@Request() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    const profile: Profile = req.profile;
    return this.profileService.update(profile.userId, updateProfileDto);
  }

  // delete the profile of signed in user
  @Delete()
  @ApiTags('Profile')
  @UseGuards(AuthorizationGuard)
  remove(@Request() req: any) {
    const profile: Profile = req.profile;
    return this.profileService.remove(profile.userId);
  }
}
