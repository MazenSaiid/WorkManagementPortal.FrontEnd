import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../environment/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class Globals {

  private _UID = "portal_guid";

  lang: string = 'en';
  loggedIn: boolean = true;
  currentUserInfo: any;

  constructor(public route: ActivatedRoute, private router: Router) {
    this.loadUserInfo();
  }

  private isClient(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  clearSession() {
    if (this.isClient()) {
      localStorage.clear();
    }
    this.loggedIn = false;
    this.router.navigate(['login']);
  }

  loadUserInfo() {
    if (this.isClient()) {
      this.loggedIn = false;
      const userInfo = localStorage.getItem(this._UID);
      if (userInfo) {
        const decryptedUser = JSON.parse(this.decryptData(userInfo));
        if (decryptedUser && decryptedUser.logged_in) {
          this.currentUserInfo = decryptedUser;
          this.loggedIn = decryptedUser.logged_in;
        }
      }
    }
  }

  updateUserLoginFlag(loginFlag: boolean) {
    if (this.isClient()) {
      if (localStorage.getItem(this._UID) != null) {
        let uid = localStorage.getItem(this._UID) ?? '';
        let UserInfo = JSON.parse(this.decryptData(uid));
        UserInfo.logged_in = loginFlag;
        UserInfo = this.encryptData(JSON.stringify(UserInfo));
        localStorage.setItem(this._UID, UserInfo);
      }
      this.loggedIn = loginFlag;
    }
  }

  updateLastActionDate(lastActionDate: Date) {
    if (this.isClient()) {
      if (localStorage.getItem(this._UID) != null) {
        let uid = localStorage.getItem(this._UID) ?? '';
        let UserInfo = JSON.parse(this.decryptData(uid));
        UserInfo.lastActionDate = lastActionDate;
        UserInfo = this.encryptData(JSON.stringify(UserInfo));
        localStorage.setItem(this._UID, UserInfo);
        this.currentUserInfo.lastActionDate = lastActionDate;
      }
    }
  }

  get UID(): string {
    return this._UID;
  }

  encryptData(data: string) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), environment.ENCRYPT_SECRET_KEY).toString();
    } catch (e) {
      console.log(e);
      return "";
    }
  }

  decryptData(data: string) {
    try {
      const bytes = CryptoJS.AES.decrypt(data, environment.ENCRYPT_SECRET_KEY);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      console.log(e);
    }
  }

  decryptDataBE(data: string) {
    const encryptedBase64Key = 'bXVzdGJlMTZieXRlc2tleQ==';
    const parsedBase64Key = CryptoJS.enc.Base64.parse(encryptedBase64Key);
    const decryptedData = CryptoJS.AES.decrypt(data, parsedBase64Key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return decryptedData.toString(CryptoJS.enc.Utf8);
  }
}
