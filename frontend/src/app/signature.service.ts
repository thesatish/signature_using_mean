import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignatureService {
  private readonly secret = 'satish-sen';

  constructor(private http: HttpClient) { }

  private generateSignature(payload: any, timestamp: string, nonce: string): string {
    const dataToSign = JSON.stringify(payload) + timestamp + nonce;
    return CryptoJS.HmacSHA256(dataToSign, this.secret).toString();
  }

  callSecureApi(payload: any): Observable<any> {
    const timestamp = Date.now().toString();
    const nonce = CryptoJS.lib.WordArray.random(16).toString();
    const signature = this.generateSignature(payload, timestamp, nonce);

    const headers = new HttpHeaders({
      'x-signature': signature,
      'x-timestamp': timestamp,
      'x-nonce': nonce
    });

    return this.http.post('http://localhost:3000/api/secure', payload, { headers });
  }
}
