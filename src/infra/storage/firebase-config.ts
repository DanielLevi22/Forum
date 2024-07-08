// src/infra/firebase.service.ts

import { Injectable } from '@nestjs/common';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { EnvService } from '../env/env.service';

@Injectable()
export class FirebaseService {
  private firebaseApp: FirebaseApp;
  public firestore: Firestore;
  public storage: FirebaseStorage;

  constructor(private envService: EnvService) {
    const firebaseConfig = {
      apiKey: this.envService.get('FIREBASE_API_KEY'),
      authDomain: this.envService.get('FIREBASE_AUTH_DOMAIN'),
      projectId: this.envService.get('FIREBASE_PROJECT_ID'),
      storageBucket: this.envService.get('FIREBASE_STORAGE_BUCKET'),
      messagingSenderId: this.envService.get('FIREBASE_MESSAGING_SENDER_ID'),
      appId: this.envService.get('FIREBASE_APP_ID')
    };

    this.firebaseApp = initializeApp(firebaseConfig);
    this.firestore = getFirestore(this.firebaseApp);
    this.storage = getStorage(this.firebaseApp);
  }
}
