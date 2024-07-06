// firebase-storage.service.ts
import { Injectable } from '@nestjs/common';
import { Uploader, UploadParams } from '@/domain/forum/application/storage/uploader';
import { randomUUID } from 'crypto';
import { getStorage, uploadBytes, getDownloadURL, ref, StorageReference } from 'firebase/storage';
import { firebasApp } from '../../firebase.config'

@Injectable()
export class FirebaseStorage implements Uploader {
  private storage: any; // Tipo do Firebase Storage
  
  constructor() {
    // Inicializa o Firebase com as configurações exportadas
    this.storage = getStorage(firebasApp);
  }

  async upload({ body, fileName, fileType }: UploadParams): Promise<{ url: string }> {
    try {
      // Gerar um ID único para o arquivo
      const uploadId = randomUUID();
      const uniqueFilename = `${uploadId}-${fileName}`;

      // Define a referência para o arquivo no Firebase Storage
      const storageRef: StorageReference = ref(this.storage, `uploads/${uniqueFilename}`);

      // Realiza o upload do arquivo
      await uploadBytes(storageRef, body);

      // Obtém a URL de download do arquivo
      const downloadURL = await getDownloadURL(storageRef);

      // Retorne a URL de download do arquivo
      return { url: downloadURL };
    } catch (error) {
      // Trate erros de upload aqui
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }
}
