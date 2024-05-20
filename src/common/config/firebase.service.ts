import { Injectable, Logger } from '@nestjs/common'
import * as firebaseAdmin from 'firebase-admin'
import * as firebaseConfig from './firebase.config.json'

//import { initializeApp } from "firebase/app";

const firebase_params = {
  type: firebaseConfig.type,
  projectId: firebaseConfig.project_id,
  privateKeyId: firebaseConfig.private_key_id,
  privateKey: firebaseConfig.private_key,
  clientEmail: firebaseConfig.client_email,
  clientId: firebaseConfig.client_id,
  authUri: firebaseConfig.auth_uri,
  tokenUri: firebaseConfig.token_uri,
  authProviderX509CertUrl: firebaseConfig.auth_provider_x509_cert_url,
  clientC509CertUrl: firebaseConfig.client_x509_cert_url
}

@Injectable()
export class FirebaseService {
  private readonly app: firebaseAdmin.app.App
  private readonly logger = new Logger(FirebaseService.name)

  constructor() {
    if (firebaseAdmin.app.length === 0) {
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(firebase_params)
      })
    }
  }

  private readonly options = {
    priority: 'high',
    timeToLive: 60 * 60 * 24
  }

  private readonly optionsSilent = {
    priority: 'high',
    timeToLive: 60 * 60 * 24,
    content_available: true
  }

  async sendNotification(deviceIds: Array<string>, payload: firebaseAdmin.messaging.MessagingPayload, silent: boolean) {
    if (deviceIds.length == 0) {
      throw new Error('You provide an empty device ids list!')
    }

    let result = null
    try {
      result = await firebaseAdmin
        .messaging()
        .sendToDevice(deviceIds, payload, silent ? this.optionsSilent : this.options)
    } catch (error) {
      this.logger.error(error.message, error.stackTrace, 'fcm-nestjs')
      throw error
    }
    return result
  }

  /**
   *
   * @param topic `all` is send to all devices
   * @param payload ref: firebaseAdmin.messaging.MessagingPayload
   * @param silent
   * @returns
   */
  async sendToTopic(topic: 'all' | string, payload: firebaseAdmin.messaging.MessagingPayload, silent: boolean) {
    if (!topic && topic.trim().length === 0) {
      throw new Error('You provide an empty topic name!')
    }

    let result = null
    try {
      result = await firebaseAdmin.messaging().sendToTopic(topic, payload, silent ? this.optionsSilent : this.options)
    } catch (error) {
      this.logger.error(error.message, error.stackTrace, 'fcm-nestjs')
      throw error
    }
    return result
  }

  //   async getFcmToken() {
  //     const messaging = getMessaging();
  //     return messaging;
  //   }

  //   async fcm(token: string, title: string, message: string) {
  //     const payload = {
  //       token,
  //       notification: {
  //         title,
  //         body: message,
  //       },
  //       data: {
  //         body: message,
  //       },
  //     };
  //     console.log(payload);
  //     const result = await admin
  //       .messaging()
  //       .send(payload)
  //       .then((response) => {
  //         return { sent_message: response };
  //       })
  //       .catch((error) => {
  //         return { error: error.code };
  //       });
  //     return result;
  //   }
}
