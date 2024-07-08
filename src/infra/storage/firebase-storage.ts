
import { Injectable } from '@nestjs/common';
import { Uploader, UploadParams } from '@/domain/forum/application/storage/uploader';
import { randomUUID } from 'crypto';
import { uploadBytes, getDownloadURL, ref, StorageReference } from 'firebase/storage';
import { FirebaseService } from './firebase-config';

@Injectable()
export class FirebaseStorage implements Uploader {
  private storage: any;

  constructor(private firebaseService: FirebaseService) {
    this.storage = firebaseService.storage
  }


  async upload({ body, fileName, fileType }: UploadParams): Promise<{ url: string }> {

    
    try {
      const uploadId = randomUUID();
      const uniqueFilename = `${uploadId}-${fileName}`;

      const storageRef: StorageReference = ref(this.storage, `uploads/${uniqueFilename}`);
      await uploadBytes(storageRef, body);
      const downloadURL = await getDownloadURL(storageRef);

      return { url: downloadURL };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }
}
