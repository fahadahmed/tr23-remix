import admin from 'firebase-admin';
import { applicationDefault, initializeApp } from 'firebase-admin/app';

require('dotenv').config();

if (!admin.apps.length) {
  initializeApp({
    credential: applicationDefault(),
    databaseURL: process.env.TR_DATABASE_URL,
  });
}

const db = admin.firestore();

export { db };
