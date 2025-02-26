import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../environment/environment';
import * as CryptoJS from 'crypto-js';
import { AccountServiceValidationResponse } from './Models/Responses/UserValidationResponse';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Globals {
  private _UID = 'portal_guid';
  loggedIn: boolean = false;
  currentUserInfo: AccountServiceValidationResponse | null = null; // This is where we store the logged-in user info
  currentUser = new ReplaySubject<AccountServiceValidationResponse | null>(1); // Observable for current user
  currentUser$ = this.currentUser.asObservable(); // Exporting the observable to be used in components

  constructor(public route: ActivatedRoute, private router: Router) {
    this.loadUserInfo(); // Attempt to load user info from localStorage when the app initializes
  }

  // Store user data in localStorage when the user logs in
  storeUserInfo(user: AccountServiceValidationResponse) {
    if (typeof localStorage !== 'undefined') {
      const encryptedUser = this.encryptData(JSON.stringify(user)); // Encrypt user data
      localStorage.setItem(this._UID, encryptedUser); // Save encrypted user data in localStorage
      this.currentUser.next(user); // Update the ReplaySubject with the new user info
      this.currentUserInfo = user; // Update the service state with user data
      this.loggedIn = true; // Update logged-in status
    }
  }

  // Clear session and logout
  clearSession() {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear(); // Clear all session data
      this.loggedIn = false;
      this.currentUserInfo = null; // Reset user info
      this.currentUser.next(null); // Emit null to indicate the user is logged out
      this.router.navigate(['']); // Navigate to login page
    }

  }

  // Load user info from localStorage
  loadUserInfo() {
    if (typeof localStorage !== 'undefined') {
      const userInfo = localStorage.getItem(this._UID); // Try to retrieve the saved user data
      if (userInfo) {
        const decryptedUser = JSON.parse(this.decryptData(userInfo));
        if (decryptedUser) {
          const expiryDate = new Date(decryptedUser.localSessionExpiryDate);
          const currentTime = new Date();

        // Check if session is expired
        if (currentTime > expiryDate) {
          this.clearSession(); // Clear session and logout
          this.loggedIn = false; 
          return false;
        }
          this.currentUserInfo = decryptedUser;
          this.loggedIn = true; // Update logged-in status
          this.currentUser.next(decryptedUser); // Emit the user info
          return true;
        }
      }
    }
    return false;
  }

  // Encrypt data using AES
  encryptData(data: string) {
    try {
      return CryptoJS.AES.encrypt(
        JSON.stringify(data),
        environment.ENCRYPT_SECRET_KEY
      ).toString();
    } catch (e) {
      return '';
    }
  }

  // Decrypt data using AES
  decryptData(data: string) {
    try {
      const bytes = CryptoJS.AES.decrypt(data, environment.ENCRYPT_SECRET_KEY);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8)); // Return decrypted data
      }
      return data;
    } catch (e) {
    }
  }

  // Decrypt data for backend service (if needed)
  decryptDataBE(data: string) {
    const encryptedBase64Key = 'bXVzdGJlMTZieXRlc2tleQ==';
    const parsedBase64Key = CryptoJS.enc.Base64.parse(encryptedBase64Key);
    const decryptedData = CryptoJS.AES.decrypt(data, parsedBase64Key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decryptedData.toString(CryptoJS.enc.Utf8);
  }

  get UID(): string {
    return this._UID;
  }
}
