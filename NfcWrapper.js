import { Component } from 'react';

import {
    Alert
} from 'react-native';

import {NfcCardModuleWrapper, NfcNativeModuleError, CardResponse, CardError} from 'ton-nfc-client';

let  nfcCardModuleWrapper = new NfcCardModuleWrapper();

printResults = (error, result) => {
    if (error != null) {
        Alert.alert(
            'Error',
            error,
            [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false}
        );
    } else {

        Alert.alert(
            'Response from card',
            result,
            [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false}
        );
    }
}

showResponse = (result) => {
    Alert.alert(
        'Response from card',
        JSON.stringify(result),
        [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false}
    );
}

showError = (error) => {
    Alert.alert(
        'Error',
        JSON.stringify(error),
        [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false}
    );
}

export default class NfcWrapper {

    /* CoinManager commands */

    getSeVersion() {
        nfcCardModuleWrapper.getSeVersion()
            .then((result) => showResponse("SE version : " + result.message)).catch((e) => showError(e.message))
    }

    getCsn() {
        nfcCardModuleWrapper.getCsn()
            .then((result) =>{ 
                console.log(result)
                showResponse("CSN (SEID, Secure Element Id) : " + result.message)
            }).catch((e) => showError(e.message))
    }

    getDeviceLabel() {
        nfcCardModuleWrapper.getDeviceLabel()
            .then((result) => showResponse("Device label : " + result.message)).catch((e) => showError(e.message))
    }

    setDeviceLabel(label) {
        nfcCardModuleWrapper.setDeviceLabel(label)
            .then((result) => showResponse("Set Device label status: " + result.message)).catch((e) => showError(e.message))
    }

    getMaxPinTries() {
        nfcCardModuleWrapper.getMaxPinTries()
            .then((result) => {
                showResponse("!Maximum Pin tries : " + result.message)
        }).catch((e) => showError(e.message))
      /* NfcCardModule.getMaxPinTries()
            .then((result) => showResponse("Maximum Pin tries : " + result)).catch((e) => showError(e.message))*/
    }

    getRemainingPinTries() {
        nfcCardModuleWrapper.getRemainingPinTries()
            .then((result) => showResponse("Remainig Pin tries : " + result.message)).catch((e) => showError(e.message))
    }

    getRootKeyStatus() {
        nfcCardModuleWrapper.getRootKeyStatus()
            .then((result) => showResponse("Root key status : " + result.message)).catch((e) => showError(e.message))
    }

    getAvailableMemory() {
        nfcCardModuleWrapper.getAvailableMemory()
            .then((result) => {
                console.log(result.message)
                showResponse("Available card's memory : " + result.message)
            }).catch((e) => showError(e.message))
    }

    getAppsList() {
        nfcCardModuleWrapper.getAppsList().then((result) => {
            console.log(result)
            showResponse("Applet AIDs list : " + result.message)
    }).catch((e) => showError(e.message))
    }

    generateSeed(pin) {
        nfcCardModuleWrapper.generateSeed(pin).then((result) => showResponse("Generate seed status : " + result.message)).catch((e) => showError(e.message))
    }

    resetWallet() {
        nfcCardModuleWrapper.resetWallet().then((result) => showResponse("Reset wallet status : " + result.message)).catch((e) => showError(e.message))
    }

    changePin(oldPin, newPin) {
        nfcCardModuleWrapper.changePin(
            oldPin,
            newPin).then((result) => showResponse("Change Pin status : " + result.message)).catch((e) => showError(e.message))
    }

    /* Commands to maintain keys for hmac */

    selectKeyForHmac(serialNumber) {
        nfcCardModuleWrapper.selectKeyForHmac(serialNumber)
            .then((result) => showResponse("Select key for hmac status : " + result.message)).catch((e) => showError(e.message))
    }

    createKeyForHmac(authenticationPassword, commonSecret, serialNumber) {
        nfcCardModuleWrapper.createKeyForHmac(authenticationPassword, commonSecret, serialNumber)
            .then((result) => showResponse("Create key for hmac status : " + result.message)).catch((e) => showError(e.message))
    }

    getCurrentSerialNumber() {
        nfcCardModuleWrapper.getCurrentSerialNumber()
            .then((result) => showResponse("Current selected serial number : " + result.message)).catch((e) => showError(e.message))
    }

    getAllSerialNumbers() {
        nfcCardModuleWrapper.getAllSerialNumbers()
            .then((result) => showResponse("All serial numbers currently supported by NFC module : " + result.message)).catch((e) => showError(e.message))
    }

    isKeyForHmacExist(serialNumber) {
        nfcCardModuleWrapper.isKeyForHmacExist(serialNumber)
            .then((result) => showResponse("Does key for hmac exist : " + result.message)).catch((e) => showError(e.message))
    }

    deleteKeyForHmac(serialNumber) {
        nfcCardModuleWrapper.deleteKeyForHmac(serialNumber)
            .then((result) => showResponse("Delete key for hmac status : " + result.message)).catch((e) => showError(e.message))
    }

    /* Card activation commands (TonWalletApplet) */


    turnOnWallet(newPin, authenticationPassword, commonSecret, initialVector) {
        nfcCardModuleWrapper.turnOnWallet(
            newPin,
            authenticationPassword,
            commonSecret,
            initialVector).then((result) => {
                console.log(result.message)
                showResponse("TonWalletApplet state : " + result.message)
        }).catch((e) => showError(e.message))
    }

    turnOnWallet(authenticationPassword, commonSecret, initialVector) {
        nfcCardModuleWrapper.turnOnWalle(
            authenticationPassword,
            commonSecret,
            initialVector).then((result) => {
                console.log(result.message)
                showResponse("TonWalletApplet state : " + result.message)
        }).catch((e) => showError(e.message))
    }

    getHashes() {
        nfcCardModuleWrapper.getHashOfEncryptedPassword().then((result) => {
            console.log(result.message)
            showResponse("Hashes : " + result.message)
    }).catch((e) => showError(e.message))
    }

    getHashOfEncryptedPassword() {
        nfcCardModuleWrapper.getHashOfEncryptedPassword().then((result) => {
            console.log(result.message)
            showResponse("Hash of encrypted password : " + result.message)
    }).catch((e) => showError(e.message))
    }

    getHashOfEncryptedCommonSecret() {
        nfcCardModuleWrapper.getHashOfEncryptedCommonSecret().then((result) => {
            console.log(result.message)
            showResponse("Hash of encrypted common secret : " + result.message)
    }).catch((e) => showError(e.message))
    }

    /* Common stuff (TonWalletApplet)  */

    getTonAppletState(){
        nfcCardModuleWrapper.getTonAppletState()
            .then((result) => {
                console.log(result.message)
                showResponse("TonWallet applet state: " + result.message)
            })
            .catch((e) => showError(e.message))
    }

    getSerialNumber(){
        nfcCardModuleWrapper.getSerialNumber()
            .then((result) => showResponse("Serial number: " + result.message))
            .catch((e) => showError(e.message))
    }

    /* Recovery data stuff (TonWalletApplet)  */

    addRecoveryData(recoveryData){
        nfcCardModuleWrapper.addRecoveryData(recoveryData)
            .then((result) => showResponse("Recovery Data: " + result.message))
            .catch((e) => showError(e.message))
    }

    getRecoveryData(){
        nfcCardModuleWrapper.getRecoveryData()
            .then((result) => showResponse("Recovery Data: " + result.message))
            .catch((e) => showError(e.message))
    }

    getRecoveryDataHash(){
        nfcCardModuleWrapper.getRecoveryDataHash()
            .then((result) => {
                console.log(result.message)
                showResponse("Recovery Data Hash: " + result.message)
            })
            .catch((e) => showError(e.message))
    }

    getRecoveryDataLen(){
        nfcCardModuleWrapper.getRecoveryDataLen()
            .then((result) => {
                console.log(result.message)
                showResponse("Recovery Data Length: " + result.message)
            })
            .catch((e) => showError(e.message))
    }

    isRecoveryDataSet(){
        nfcCardModuleWrapper.isRecoveryDataSet()
            .then((result) => {
                console.log(result)
                showResponse("isRecoveryDataSet flag: " + result.message)
            })
            .catch((e) => showError(e.message))
    }

    resetRecoveryData(){
        nfcCardModuleWrapper.resetRecoveryData()
            .then((result) => showResponse("Reset recovery data status: " + result.message))
            .catch((e) => showError(e.message))
    }

    enncryptAndAddRecoveryData(recoveryData, key){
        console.log("Raw recovery data : " + recoveryData);
        var recoveryDataBytes = aesjs.utils.utf8.toBytes(recoveryData);
         
        // The counter is optional, and if omitted will begin at 1
        var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
        var encryptedBytes = aesCtr.encrypt(recoveryDataBytes);
         
        // To print or store the binary data, you may convert it to hex
        var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
        console.log("Encrypted recovery data : " +encryptedHex);

        return nfcCardModuleWrapper.addRecoveryData(encryptedHex)
            /*.then((result) => {
                showResponse("Add Recovery Data: " + result)
                console.log("Add Recovery Data: " + result)
                return result;
            })
            .catch((e) => {
                showError(e.message)
                console.log(e.message)
            })*/
    }

    /* TonWalletApplet commands (ed25519 related) */

    /* verifyDefaultPin(){
         nfcCardModuleWrapper.verifyDefaultPin()
             .then((result) => showResponse("verifyDefaultPin result: " + result))
             .catch((e) => showError(e.message))
     }*/


    getPublicKeyForDefaultPath(){
        nfcCardModuleWrapper.getPublicKeyForDefaultPath()
            .then((result) => {
                console.log(result.message)
                showResponse("Public key for default HD path m/44'/396'/0'/0'/0' : " + result.message)
            })
            .catch((e) => showError(e.message))
    }

    async verifyPin(pin) {
        try {
            let result = await nfcCardModuleWrapper.verifyPin(pin);
            console.log(result.message)
            showResponse("verifyPin result: " + result.message)
        }
        catch (e) {
            showError(e.message)
        }
    }

    getPublicKey(hdIndex) {
        nfcCardModuleWrapper.getPublicKey(hdIndex)
            .then((result) => {
                console.log(result.message)
                showResponse("Public key for HD path m/44'/396'/0'/0'/" + hdIndex + "' : " + result.message)
            })
            .catch((e) => showError(e.message))
    }

    async signForDefaultHdPath(dataForSigning) {
        try {
            let result = await nfcCardModuleWrapper.signForDefaultHdPath(dataForSigning)
            console.log(result.message)
            showResponse("Signature : " + result.message)
        }
        catch (e) {
            showError(e.message)
        }
    }

    async sign(dataForSigning, hdIndex) {
        try {
            let result = await nfcCardModuleWrapper.sign(dataForSigning, hdIndex)
            console.log(result.message)
            showResponse("Signature : " + result.message)
        }
        catch (e) {
            showError(e.message)
        }
    }

    async verifyPinAndSignForDefaultHdPath(dataForSigning, pin) {
        try {
            let result = await nfcCardModuleWrapper.verifyPinAndSignForDefaultHdPath(dataForSigning, pin)
            console.log(result.message)
            showResponse("Signature : " + result.message)
        }
        catch (e) {
            showError(e.message)
        }
    }

    async verifyPinAndSign(dataForSigning, hdIndex, pin) {
        try {
            let result = await nfcCardModuleWrapper.verifyPinAndSign(dataForSigning, hdIndex, pin)
            console.log(result.message)
            showResponse("Signature : " + result.message)
        }
        catch (e) {
            showError(e.message)
        }
    }

    /* Keychain commands */

    async resetKeyChain(){
        try {
            let result = await nfcCardModuleWrapper.resetKeyChain();
            showResponse("resetKeyChain status :" + result.message)
        }
        catch (e) {
            showError(e.message)
        }
    }

    async getKeyChainDataAboutAllKeys(){
        try {
            let result = await nfcCardModuleWrapper.getKeyChainDataAboutAllKeys();
            console.log(result)
            showResponse("getKeyChainDataAboutAllKeys status :" + result.message)
        }
        catch (e) {
            showError(e.message)
        }    
    }

    async getKeyChainInfo(){
        try {
            let result = await nfcCardModuleWrapper.getKeyChainInfo();
           // var obj = JSON.parse(result);
          //  console.log(result)
            showResponse("KeyChain info: Number of keys = " +  result.numberOfKeys + ", Occupied size = "
                    + result.occupiedSize + ", Free size = "  + result.freeSize);
        }
        catch (e) {
            showError(e.message)
        } 
    }

    async getNumberOfKeys(){
        try {
            let result = await nfcCardModuleWrapper.getNumberOfKeys();
            console.log(result.message)
            showResponse("getKeyChainDataAboutAllKeys status :" + result.message)
        }
        catch (e) {
            showError(e.message)
        }  
    }

    async getOccupiedStorageSize(){
        try {
            let result = await nfcCardModuleWrapper.getOccupiedStorageSize();
            console.log(result.message)
            showResponse("getOccupiedStorageSize status :" + result.message)
        }
        catch (e) {
            showError(e.message)
        }  
    }

    async getFreeStorageSize(){
        try {
            let result = await nfcCardModuleWrapper.getFreeStorageSize();
            console.log(result.message)
            showResponse("getFreeStorageSize status :" + result.message)
        }
        catch (e) {
            showError(e.message)
        }  
    }

    async getKeyFromKeyChain(keyHmac){
        try {
            let result = await nfcCardModuleWrapper.getKeyFromKeyChain(keyHmac);
            console.log(result.message)
            showResponse("Key : " + result.message)
        }
        catch (e) {
            showError(e.message)
        }  
    }

    async addKeyIntoKeyChain(newKey){
        try {
            let result = await nfcCardModuleWrapper.addKeyIntoKeyChain(newKey);
            showResponse("Add key status (hmac of new key) : "  + result.message)
        }
        catch (e) {
            showError(e.message)
        } 
    }

    /*  deleteKeyFromKeyChain(keyHmac){
          nfcCardModuleWrapper.deleteKeyFromKeyChain(keyHmac).then((result) => showResponse("Delete key status (number of remained keys) : " + result))
              .catch((e) => showError(e.message))
      }

      finishDeleteKeyFromKeyChainAfterInterruption(keyHmac){
          nfcCardModuleWrapper.finishDeleteKeyFromKeyChainAfterInterruption(keyHmac).then((result) => showResponse("Finish Delete key status after interruption (number of remained keys) : " + result))
              .catch((e) => showError(e.message))
      }*/

    async changeKeyInKeyChain(newKey, oldKeyHmac){
        try {
            let result = await nfcCardModuleWrapper.changeKeyInKeyChain(newKey, oldKeyHmac);
            showResponse("Change key status (hmac of new key) : "  + result.message)
        }
        catch (e) {
            showError(e.message)
        } 
    }

    async getIndexAndLenOfKeyInKeyChain(keyHmac){
        try {
            let result = await nfcCardModuleWrapper.getIndexAndLenOfKeyInKeyChain(keyHmac);
            console.log(result)
            showResponse("getIndexAndLenOfKeyInKeyChain response : " + result.message)
        }
        catch (e) {
            showError(e.message)
        }
    }

    async checkAvailableVolForNewKey(keySize){
        try {
            let result = await nfcCardModuleWrapper.checkAvailableVolForNewKey(keySize);
            showResponse("checkAvailableVolForNewKey response : "  + result.message)
        }
        catch (e) {
            showError(e.message)
        }
    }

    async checkKeyHmacConsistency(keyHmac){
        try {
            let result = await nfcCardModuleWrapper.checkKeyHmacConsistency(keyHmac);
            showResponse("checkKeyHmacConsistency response : "  + result.message)
        }
        catch (e) {
            showError(e.message)
        }
    }


}
