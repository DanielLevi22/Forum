import { Module } from '@nestjs/common';
import { Uploader } from '@/domain/forum/application/storage/uploader';
import { FirebaseStorage } from './firebase-storage';
import { EnvModule } from '../env/env.module';
import { FirebaseService } from './firebase-confiig';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: FirebaseStorage, 
    },
    FirebaseStorage, 
    FirebaseService
  ],
  exports: [
    Uploader,
    FirebaseStorage,
    FirebaseService
  ],
})
export class StorageModule {}
