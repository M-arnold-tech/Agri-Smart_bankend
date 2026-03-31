import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { UserRole } from '../common/decorators/roles.decorator';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private config: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const email = this.config.get<string>('admin.email');
    const password = this.config.get<string>('admin.password');
    const firstName = this.config.get<string>('admin.firstName') || 'System';
    const lastName = this.config.get<string>('admin.lastName') || 'Admin';

    if (!email || !password) {
      this.logger.warn(
        'ADMIN_EMAIL or ADMIN_PASSWORD not set in .env — skipping admin seed.',
      );
      return;
    }

    const existing = await this.usersRepo.findOne({ where: { email } });
    if (existing) {
      existing.password = await bcrypt.hash(password, 12);
      await this.usersRepo.save(existing);
      this.logger.log(`Admin account already exists: ${email}. Password synchronized with .env.`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = this.usersRepo.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: UserRole.ADMIN,
      isActive: true,
    });

    await this.usersRepo.save(admin);
    this.logger.log(`✅ Default admin created successfully: ${email}`);
  }
}
