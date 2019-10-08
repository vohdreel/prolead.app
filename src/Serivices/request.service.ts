import { Headers,RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import CryptoJS from 'crypto-js';

 @Injectable()
export class RequestService {
  key="proleadshapeness";

  constructor( 
    private storage:Storage

  ) { }

  decrypt(data) {
    let key = this.key;
    let bytes = CryptoJS.AES.decrypt(data, key);
    let tokenDescriptografado = bytes.toString(CryptoJS.enc.Utf8);
    return tokenDescriptografado.substring(1,tokenDescriptografado.length-1);//ignora aspas duplicadas
  }

  getOptions = new Promise((resolve,reject)=>{
    this.storage.ready()
    .then(() =>{
          this.storage.get('token').then((tokenCriptografado)=>{
                let token = this.decrypt(tokenCriptografado);
                let header = new Headers();
                header.append("Authorization",'Bearer ' +token );
                let options = new RequestOptions({ headers: header });
              resolve(options);
          }).catch(()=>{
            let msg = "Não foi possível recuperar seu token";
            reject(msg);
          })
    })

  })

}