import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagesModule } from '../pages/pages.module';
import { EventDetails } from './entities/event.entity';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [TypeOrmModule.forFeature([EventDetails]), PagesModule, MediaModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}