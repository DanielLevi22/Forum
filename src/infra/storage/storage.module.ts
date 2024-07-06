import { Module } from '@nestjs/common';
import { Uploader } from '@/domain/forum/application/storage/uploader';
import { FirebaseStorage } from './firebase-storage';
import { EnvModule } from '../env/env.module';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: FirebaseStorage, 
    },
    FirebaseStorage, 
  ],
  exports: [
    Uploader,
    FirebaseStorage,
  ],
})
export class StorageModule {}
