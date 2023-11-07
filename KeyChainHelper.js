import React from 'react';
import HexHelper from "./HexHelper";
import {NfcCardModuleWrapper, NfcNativeModuleError, CardResponse, CardError} from 'ton-nfc-client';

let  nfcCardModuleWrapper = new NfcCardModuleWrapper();

export default class KeyChainHelper {
    static MAX_KEY_LEN = 8192;
    static SW_INCORRECT_KEY_INDEX  = "7f";
    
    resetKeyChain(){
        nfcCardModuleWrapper.resetKeyChain().then((result) => alert("resetKeyChain status : " + result.message)).catch((e) => alert(e.message))
    }

    async addKey(key){
        await new Promise(r => setTimeout(r, 5000))
        var keyHmac = await nfcCardModuleWrapper.addKeyIntoKeyChain(key)
        return keyHmac.message
    }

    async getKey(keyHmac){
        await new Promise(r => setTimeout(r, 5000))
        var keyFromCard = await nfcCardModuleWrapper.getKeyFromKeyChain(keyHmac);
        return keyFromCard.message
    }

    async changeKey(newKey, oldKeyHmac){
        await new Promise(r => setTimeout(r, 5000))
        var newKeyHmac = await nfcCardModuleWrapper.changeKeyInKeyChain(newKey, oldKeyHmac)
        console.log("Hmac of new key = " + newKeyHmac.message);
        alert("Hmac of new key = " + newKeyHmac.message);
        return newKeyHmac.message
    }

    async testAddGetMultipleKey(keyLen, numberOfKeys) {
        try {
            var keyMacs = [];
            var keys = [];
            await this.getAndPrintKeyChainInfo()
            for (let i = 0; i < numberOfKeys; i++) {
                let key = HexHelper.genHexString(2 * keyLen);
                console.log("-------------------------------------");
                console.log("-------------------------------------");
                await new Promise(r => setTimeout(r, 5000))
                if (keyLen <= 32) {
                    console.log("Key #" + i + " to add (of length = " + keyLen + " bytes) = " + key);
                    alert("Key #" + i + " to add (of max length = " + keyLen + " bytes) = " + key)
                }
                else {
                    console.log("Key #" + i + " to add (of length = " + keyLen + " bytes) = " + key.substring(0, 64) + "...(too long to show)");
                    alert("Key #" + i + " to add (of max length = " + keyLen + " bytes) = " + key.substring(0, 64) + "...(too long to show)")
                }
                var keyHmac = await this.addKey(key)
                console.log("Hmac of added key #" + i + " = " + keyHmac);
                alert("Hmac of added key#" + i + " = " + keyHmac);
                keyMacs.push(keyHmac);
                keys.push(key)
            }

            await this.getAndPrintKeyChainInfo()

            for (let i = 0; i < numberOfKeys; i++) {
                var keyHmac = keyMacs[i];
                await new Promise(r => setTimeout(r, 5000))
                console.log("-------------------------------------");
                console.log("-------------------------------------");
                console.log("Iteration #" + i + " : ");
                console.log("Hmac of key #" + i + " to get from card = " + keyHmac);
                alert("Hmac of key #" + i + " to get from card = " + keyHmac);
            
                var keyFromCard = await this.getKey(keyHmac);

                console.log("Key generated by host = " + keys[i]);
                if (keyLen <= 32) {
                    console.log("Got Key #" + i + " from card = " + keyFromCard);
                    alert("Got Key #" + i + " from card = " + keyFromCard);
                }
                else {
                    console.log("Got Key #" + i + " from card = " + keyFromCard.substring(0, 64) + "...(too long to show)");
                    alert("Got Key #" + i + " from card = " + keyFromCard.substring(0, 64) + "...(too long to show)");
                }
                if (keys[i].toLowerCase() != keyFromCard.toLowerCase()) {
                    throw new Error("Keys are different.");
                }
            }

            await this.getAndPrintKeyChainInfo()
            await this.callResetKeyChain()
            
            console.log("Keychain is clear. Test passed!");
            alert("Keychain is clear. Test passed!")


        }
        catch(err) {
            await new Promise(r => setTimeout(r, 5000))
            alert("Error happened : " + err.message)
        }
  
    }

    /*
        Tests for change operation 
    */

    async testAddChangeGetOneKey() {
        try {
            await this.getAndPrintKeyChainInfo()
            let keyLen = KeyChainHelper.MAX_KEY_LEN;
            let key = HexHelper.genHexString(2*keyLen);
            if (keyLen <= 32) {
                console.log("Key to add (of length = " + keyLen + " bytes) = " + key);
                alert("New key to add (of max length = " + keyLen + " bytes) = " + key)
            }
            else {
                console.log("Key to add (of length = " + keyLen + " bytes) = " + key.substring(0, 64) + "...(too long to show)");
                alert("Key to add (of max length = " + keyLen + " bytes) = " + key.substring(0, 64) + "...(too long to show)")
            }

            var keyHmac = await this.addKey(key)
            await new Promise(r => setTimeout(r, 5000))
            console.log("Hmac of added key  = " + keyHmac);
            alert("Hmac of added key = " + keyHmac);

            var keyFromCard = await this.getKey(keyHmac);
            if (keyLen <= 32) {
                console.log("Got Key from card = " + keyFromCard);
                alert("Got Key from card = " + keyFromCard);
            }
            else {
                console.log("Got Key  from card = " + keyFromCard.substring(0, 64) + "...(too long to show)");
                alert("Got Key  from card = " + keyFromCard.substring(0, 64) + "...(too long to show)");
            }

            console.log("Key from card = " + keyFromCard);
            if (key.toLowerCase() != keyFromCard.toLowerCase()) {
                throw new Error("Add/get key error: Keys are different.");
            }

            var newKey = HexHelper.genHexString(2*keyLen);
            await new Promise(r => setTimeout(r, 5000))
            if (keyLen <= 32) {
                console.log("New Key to change old key (of length = " + keyLen + " bytes) = "  + newKey);
                alert("New Key to change old key (of length = " + keyLen + " bytes) = "  + newKey);
            }
            else {
                console.log("New Key to change old key (of length = " + keyLen + " bytes) = "  + newKey.substring(0, 64) + "...(too long to show)");
                alert("New Key to change old key (of length = " + keyLen + " bytes) = "  + newKey.substring(0, 64) + "...(too long to show)");
            }
            var newKeyHmac = await this.changeKey(newKey, keyHmac);
            await new Promise(r => setTimeout(r, 5000))
            console.log("Hmac of new added key  = " + newKeyHmac);
            alert("Hmac of new added key = " + newKeyHmac);

            var newKeyFromCard = await this.getKey(newKeyHmac);

            if (keyLen <= 32) {
                console.log("New Key from card = " + newKeyFromCard);
                alert("New Key from card = " + newKeyFromCard);
            }
            else {
                console.log("New Key from card = " + newKeyFromCard.substring(0, 64) + "...(too long to show)");
                alert("New Key from card= " + newKeyFromCard.substring(0, 64) + "...(too long to show)");
            }

            if (newKey.toLocaleLowerCase() != newKeyFromCard.toLowerCase()) {
                throw new Error("Change key error: New key and key from card are different.");
            }

            console.log("Try to request old key");
            alert("Try to request old key");
            await this.getKey(keyHmac);
            throw new Error("Old hmac still in the card");

        }
        catch(e) {
            await new Promise(r => setTimeout(r, 5000))
            if (!e.message.toLowerCase().includes(KeyChainHelper.SW_INCORRECT_KEY_INDEX)) {
                alert("Error happened: " + e.message);
            }
            else {
                await this.getAndPrintKeyChainInfo()
                await this.callResetKeyChain()
                alert("Keychain is clear. Old hmac was deleted correctly. Keychain is clear. Test passed!")
                console.log("Test passed. Old hmac was deleted correctly");
            }
        }
    }

    async testAddGetChangeMultipleKey(keyLen, numberOfKeys) {
        try {
            var startTime;
            var keyMacs = [];
            var keys = [];
            await this.getAndPrintKeyChainInfo()
            for (let i = 0; i < numberOfKeys; i++) {
                let key = HexHelper.genHexString(2 * keyLen);
                console.log("-------------------------------------");
                console.log("-------------------------------------");
                await new Promise(r => setTimeout(r, 5000))
                if (keyLen <= 32) {
                    console.log("Key #" + i + " to add (of length = " + keyLen + " bytes) = " + key);
                    alert("Key #" + i + " to add (of max length = " + keyLen + " bytes) = " + key)
                }
                else {
                    console.log("Key #" + i + " to add (of length = " + keyLen + " bytes) = " + key.substring(0, 64) + "...(too long to show)");
                    alert("Key #" + i + " to add (of max length = " + keyLen + " bytes) = " + key.substring(0, 64) + "...(too long to show)")
                }

                await new Promise(r => setTimeout(r, 5000))
                var res  = await nfcCardModuleWrapper.addKeyIntoKeyChain(key);
                var keyHmac = res.message;
                console.log("Hmac of added key #" + i + " = " + keyHmac);
                alert("Hmac of added key#" + i + " = " + keyHmac);
                keyMacs.push(keyHmac);
                keys.push(key)
            }

            await this.getAndPrintKeyChainInfo()

            for (let i = 0; i < numberOfKeys; i++) {
                var keyHmac = keyMacs[i];
                await new Promise(r => setTimeout(r, 5000))
                console.log("-------------------------------------");
                console.log("-------------------------------------");
                console.log("Iteration #" + i + " : ");
                console.log("Hmac of key #" + i + " to get from card = " + keyHmac);
                alert("Hmac of key #" + i + " to get from card = " + keyHmac);
                await new Promise(r => setTimeout(r, 5000))
                var res = await nfcCardModuleWrapper.getKeyFromKeyChain(keyHmac);
                var keyFromCard = res.message
                console.log("Key generated by host = " + keys[i]);
                if (keyLen <= 32) {
                    console.log("Got Key #" + i + " from card = " + keyFromCard);
                    alert("Got Key #" + i + " from card = " + keyFromCard);
                }
                else {
                    console.log("Got Key #" + i + " from card = " + keyFromCard.substring(0, 64) + "...(too long to show)");
                    alert("Got Key #" + i + " from card = " + keyFromCard.substring(0, 64) + "...(too long to show)");
                }
                if (keys[i].toLowerCase() != keyFromCard.toLowerCase()) {
                    throw new Error("Keys are different.");
                }

                await new Promise(r => setTimeout(r, 5000))
                alert("Start change..");
                await new Promise(r => setTimeout(r, 5000))
        
                var newKey = HexHelper.genHexString(2 * keyLen);
                if (keyLen <= 32) {
                    console.log("New Key #" + i + " to change old key = " + newKey);
                    alert("New Key #" + i + " to change old key = " + newKey);
                }
                else {
                    console.log("New Key #" + i + " to change old key = " + newKey.substring(0, 64) + "...(too long to show)");
                    alert("New Key #" + i + " to change old key = " + newKey.substring(0, 64) + "...(too long to show)");
                }
                await new Promise(r => setTimeout(r, 5000))
                startTime = performance.now();
                var res = await nfcCardModuleWrapper.changeKeyInKeyChain(newKey, keyMacs[i]);
                var newHmac = res.message;
                var endTime = performance.now();
                var timeDiff = endTime - startTime; //in ms
                console.log("-------------------------------------");
                console.log("-------------------------------------");
                alert("key #" + i + " is changed , " + "\n" +
                    "Elapsed time: " + timeDiff + " milli seconds");
                console.log("key #" + i + " is is changed ");
                console.log("Elapsed time: " + timeDiff + " milli seconds");
                console.log("Hmac of new key = " + newHmac);
                await new Promise(r => setTimeout(r, 5000))
                res = await nfcCardModuleWrapper.getKeyFromKeyChain(newHmac);
                var newKeyFromCard = res.message;
                if (keyLen <= 32) {
                    console.log("Got New Key from card #" + i + "  = " + newKeyFromCard);
                    alert("Got New Key from card #" + i + " = " + newKeyFromCard);
                }
                else {
                    console.log("Got New Key from card #" + i + "  = " + newKeyFromCard.substring(0, 64) + "...(too long to show)");
                    alert("Got New Key from card #" + i + " = " + newKeyFromCard.substring(0, 64) + "...(too long to show)");
                }

                if (newKeyFromCard.toLowerCase() != newKey.toLowerCase()) {
                    throw new Error("New Keys are different.");
                }

            }

            await this.getAndPrintKeyChainInfo()
            await this.callResetKeyChain()
            
            console.log("Keychain is clear. Test passed!");
            alert("Keychain is clear. Test passed!")


        }
        catch(err) {
            await new Promise(r => setTimeout(r, 5000))
            alert("Error happened : " + err.message)
        }
  
    }

    /*
        Tests for delete operation 
    */

   async testAddGetDeleteOneKeyOfMaxLen() {
        try {
            let keyLen = KeyChainHelper.MAX_KEY_LEN;
            let key = HexHelper.genHexString(2 * keyLen);
            var oldKeyHmac = "";
            if (keyLen <= 32) {
                console.log("New key to add (of length = " + keyLen + " bytes) = " + key);
                alert("New key to add (of max length = " + keyLen + " bytes) = " + key)
            }
            else {
                console.log("New key to add (of length = " + keyLen + " bytes) = " + key.substring(0, 64) + "...(too long to show)");
                alert("New key to add (of max length = " + keyLen + " bytes) = " + key.substring(0, 64) + "...(too long to show)")
            }
            await new Promise(r => setTimeout(r, 5000))
            var res = await nfcCardModuleWrapper.addKeyIntoKeyChain(key);
            var keyHmac = res.message;
            console.log("res = " + res);
            console.log("res.message = " + res.message);
            oldKeyHmac = keyHmac;
            console.log("Hmac of added key = " + oldKeyHmac);
            alert("Hmac of added key = " + oldKeyHmac)
            await new Promise(r => setTimeout(r, 5000))
            
            
            res = await nfcCardModuleWrapper.getKeyFromKeyChain(oldKeyHmac);
            console.log("res = " + res);
            var keyFromCard = res.message;

            if (keyLen <= 32) {
                console.log("Got Key from card = " + keyFromCard);
                alert("Got Key from card = " + keyFromCard);
            }
            else {
                console.log("Got Key from card = " + keyFromCard.substring(0, 64) + "...(too long to show)");
                alert("Got Key from card = " + keyFromCard.substring(0, 64) + "...(too long to show)");
            }
            if (key.toLowerCase() != keyFromCard.toLowerCase()) {
                throw new Error("Add/get key error: Keys are different.");
            }

            console.log("Request number of keys...");
            await new Promise(r => setTimeout(r, 5000))
            res = await nfcCardModuleWrapper.getNumberOfKeys();
            var numOfKeys = res.message;
            console.log("Number of keys = " + numOfKeys);
            alert("Number of keys = " + numOfKeys);
            if (numOfKeys != "1") {
                throw new Error("Number of keys is incorrect. It must be = 1.");
            }

            await new Promise(r => setTimeout(r, 5000))
            await nfcCardModuleWrapper.deleteKeyFromKeyChain(oldKeyHmac);

            console.log("Key is deleted. Request number of keys...");
            alert("Key is deleted. Request number of keys...");
            await new Promise(r => setTimeout(r, 5000))
            res = await nfcCardModuleWrapper.getNumberOfKeys();
            numOfKeys = res.message;

            console.log("Number of keys = " + numOfKeys);
            alert("Number of keys = " + numOfKeys);
            if (numOfKeys != "0") {
                throw new Error("Number of keys is incorrect. It must be = 0.");
            }

            console.log("Try to request old key");
            alert("Try to request old key");
            await new Promise(r => setTimeout(r, 5000))
            await nfcCardModuleWrapper.getKeyFromKeyChain(oldKeyHmac);
            throw new Error("Old hmac still in the card");
        }
        catch(e) {
            await new Promise(r => setTimeout(r, 5000))
            
            if (!e.message.toLowerCase().includes(KeyChainHelper.SW_INCORRECT_KEY_INDEX)) {
                alert("Error happened: " + e.message);
            }
            else {
                await new Promise(r => setTimeout(r, 5000))
                alert("Test passed. Old hmac was deleted correctly");
                console.log("Test passed. Old hmac was deleted correctly");
            }

            await this.callResetKeyChain()
        }
    }

    //add one key of len 1 and second key of len keyKen
    //then delete first key
    async testAddGetDeleteTwoKeys(keyLen) {
        try {
            let firstKey = HexHelper.genHexString(2);
            console.log("New key#1 to add (of length 1 byte) = " + firstKey);
            alert("New key#1 to add (of max length 1 byte) = " + firstKey);
            await new Promise(r => setTimeout(r, 5000))
            
            var res = await nfcCardModuleWrapper.addKeyIntoKeyChain(firstKey);
            var firstKeyHmac = res.message;

            console.log("Hmac of added key#1 = " + firstKeyHmac);
            alert("Hmac of added key#1 = " + firstKeyHmac)

            let secondKey = HexHelper.genHexString(2 * keyLen);
            await new Promise(r => setTimeout(r, 5000))

            console.log("New key #2 to add (of length = " + keyLen + " bytes) = " + secondKey.substring(0, 64) + "...(too long to show)");
            alert("New key #2 to add (of length = " + keyLen + " bytes) = " + secondKey.substring(0, 64) + "...(too long to show)")

            await new Promise(r => setTimeout(r, 5000))
            var res = await nfcCardModuleWrapper.addKeyIntoKeyChain(secondKey);
            var secondKeyHmac = res.message; 

            console.log("Hmac of added key#2 = " + secondKeyHmac);
            alert("Hmac of added key#2 = " + secondKeyHmac)

            await new Promise(r => setTimeout(r, 5000))
            var keyChainInfo = await nfcCardModuleWrapper.getKeyChainInfo();

            console.log("KeyChain info: Number of keys = " +  keyChainInfo.numberOfKeys + ", Occupied size = "
                    + keyChainInfo.occupiedSize + ", Free size = "  + keyChainInfo.freeSize);
            console.log("-------------------------------------");
            console.log("-------------------------------------");
            alert("KeyChain info: Number of keys = " +  keyChainInfo.numberOfKeys + ", Occupied size = "
                + keyChainInfo.occupiedSize + ", Free size = "  + keyChainInfo.freeSize + "\n Start key deleting from the card...")
            
            await new Promise(r => setTimeout(r, 5000))
            var startTime = performance.now();
            console.log("Start key deleting from the card...");
            await this.deleteKey(firstKeyHmac)

            var endTime = performance.now();
            var timeDiff = endTime - startTime; //in ms
            alert("Key is deleted. Elapsed time: " + timeDiff + " milli seconds. \n Request number of keys...");
            console.log("Elapsed time: " + timeDiff + " milli seconds");
            console.log("Key is deleted. Request info about keychain.");

            await this.getAndPrintKeyChainInfo()
            await this.callResetKeyChain()
            
            console.log("Keychain is clear. Test passed!");
            alert("Keychain is clear. Test passed!")
        }
        catch(err) {
            await new Promise(r => setTimeout(r, 5000))
            alert("Error happened : " + err.message)
        }
    }

    // Add  numberOfKeys keys of len  keyLen into card, then get each of them from the card, verify 
    //correctness and delete
    async testAddGetDeleteMultipleKey(keyLen, numberOfKeys) {
        try {
            var keyMacs = [];
            var keys = [];

            for (let i = 0; i < numberOfKeys; i++) {
                let key = HexHelper.genHexString(2 * keyLen);
                console.log("-------------------------------------");
                console.log("-------------------------------------");
                await new Promise(r => setTimeout(r, 5000))
                if (keyLen <= 32) {
                    console.log("New key #" + i + " to add (of length = " + keyLen + " bytes) = " + key);
                    alert("New key #" + i + " to add (of max length = " + keyLen + " bytes) = " + key)
                }
                else {
                    console.log("New key #" + i + " to add (of length = " + keyLen + " bytes) = " + key.substring(0, 64) + "...(too long to show)");
                    alert("New key #" + i + " to add (of max length = " + keyLen + " bytes) = " + key.substring(0, 64) + "...(too long to show)")
                }
                var res = await nfcCardModuleWrapper.addKeyIntoKeyChain(key);
                var keyHmac = res.message;

                console.log("Hmac of added key #" + i + " = " + keyHmac);
                alert("Hmac of added key#" + i + " = " + keyHmac);
                keyMacs.push(keyHmac);
                keys.push(key)
            }

            await this.getAndPrintKeyChainInfo()

            await new Promise(r => setTimeout(r, 5000))
            console.log("Start retrieving and deleting keys from the card:");
            alert("Start retrieving and deleting keys from the card:");

            var numOfKeysLeft = numberOfKeys 
            for (let i = 0; i < numberOfKeys; i++) {
                var keyHmac = keyMacs[i];
                await new Promise(r => setTimeout(r, 5000))
                console.log("-------------------------------------");
                console.log("-------------------------------------");
                console.log("Iteration #" + i + " : ");
                console.log("Hmac of key #" + i + " to get from card = " + keyHmac);
                alert("Hmac of key #" + i + " to get from card = " + keyHmac);
                await new Promise(r => setTimeout(r, 5000))
                var res = await nfcCardModuleWrapper.getKeyFromKeyChain(keyHmac);
                var keyFromCard = res.message;
                console.log("Key generated by host = " + keys[i]);
                if (keyLen <= 32) {
                    console.log("Got Key #" + i + " from card = " + keyFromCard);
                    alert("Got Key #" + i + " from card = " + keyFromCard);
                }
                else {
                    console.log("Got Key #" + i + " from card = " + keyFromCard.substring(0, 64) + "...(too long to show)");
                    alert("Got Key #" + i + " from card = " + keyFromCard.substring(0, 64) + "...(too long to show)");
                }
                if (keys[i].toLowerCase() != keyFromCard.toLowerCase()) {
                    throw new Error("Keys are different.");
                }
                await new Promise(r => setTimeout(r, 5000))
                alert("Start delete key#" + i);
                console.log("Start delete key#" + i);
                await new Promise(r => setTimeout(r, 5000))
                var startTime = performance.now();
                await this.deleteKey(keyMacs[i])
                var endTime = performance.now();
                var timeDiff = endTime - startTime; //in ms
                numOfKeysLeft = numOfKeysLeft - 1
                console.log("-------------------------------------");
                console.log("-------------------------------------");
                alert("key #" + i + " is deleted to get from card , numOfKeysLeft = " + numOfKeysLeft + "\n" +
                "Elapsed time: " + timeDiff + " milli seconds");
                console.log("key #" + i + " is deleted to get from card");
                console.log("Elapsed time: " + timeDiff + " milli seconds");

                await new Promise(r => setTimeout(r, 5000))
                console.log("Request number of keys...");
                alert("Request number of keys...");
                await new Promise(r => setTimeout(r, 5000))
                res = await nfcCardModuleWrapper.getNumberOfKeys();
                var num = res.message; 
                console.log("Read real Number of keys from card = " + num);
                alert("Read real Number of keys from card = " + num);
                if (parseInt(num) != numOfKeysLeft ) {
                    throw new Error("Number of keys is incorrect.");
                }
            }

            console.log("Final Request number of keys...");
            await new Promise(r => setTimeout(r, 5000))
            var res = await nfcCardModuleWrapper.getNumberOfKeys();
            var finalNum = res.message;
            console.log("Number of keys = " + finalNum);
            if (finalNum != "0") {
                throw new Error("Number of keys is incorrect. It must be = 0.");
            }
            
            console.log("Test passed!");
            alert("Test passed!")
        }
        catch(err) {
            await new Promise(r => setTimeout(r, 5000))
            alert("Error happened : " + err.message)
        }
    }

    async testDeleteForMaxNumOfKeys() {      
        try {
            await this.getAndPrintKeyChainInfo()
            await new Promise(r => setTimeout(r, 5000))
            for (let i = 0; i < 2; i++) {   
                await new Promise(r => setTimeout(r, 5000))
                var result = await nfcCardModuleWrapper.getHmac("0");
                var hmac = result.hmac;
                console.log("hmac of key to delete = " + hmac)
                alert("hmac of key to delete = " + hmac)
                await new Promise(r => setTimeout(r, 5000))
                var startTime = performance.now();
                await this.deleteKey(hmac)
                var endTime = performance.now();
                var timeDiff = endTime - startTime; //in ms
                alert("Key is deleted. Elapsed time: " + timeDiff + " milli seconds. \n Request info about keychain...");
                console.log("Elapsed time: " + timeDiff + " milli seconds");
                console.log("Key is deleted. Request info about keychain..");
                await this.getAndPrintKeyChainInfo()
            }
            await new Promise(r => setTimeout(r, 5000))
            console.log("Test passed!");
            alert("Test passed!")
        }
        catch(err) {
            await new Promise(r => setTimeout(r, 5000))
            alert("Error happened : " + err.message)
        }
    }

    async deleteKey(hmac) { 
        try{
            await new Promise(r => setTimeout(r, 5000))
            var res = await nfcCardModuleWrapper.deleteKeyFromKeyChain(hmac);
            console.log(res.message)
        }
        catch(err) {
            alert(err); 
            if (err.message.includes("failed: 00, 00")) {
                while(true) {
                    try {
                        await new Promise(r => setTimeout(r, 5000))
                        var res = await nfcCardModuleWrapper.finishDeleteKeyFromKeyChainAfterInterruption(hmac);
                        console.log(res.message)
                        break;
                    }
                    catch(err) {
                        alert(err);
                        if (!err.message.includes("failed: 00, 00"))  {
                            break;
                        }
                    }
                }
            }
        }
    }

    async getAndPrintKeyChainInfo() {
        await new Promise(r => setTimeout(r, 5000))
        var keyChainInfo = await nfcCardModuleWrapper.getKeyChainInfo();
        console.log("KeyChain info: Number of keys = " +  keyChainInfo.numberOfKeys + ", Occupied size = "
                + keyChainInfo.occupiedSize + ", Free size = "  + keyChainInfo.freeSize);
        console.log("-------------------------------------");
        console.log("-------------------------------------");
        alert("KeyChain info: Number of keys = " +  keyChainInfo.numberOfKeys + ", Occupied size = "
            + keyChainInfo.occupiedSize + ", Free size = "  + keyChainInfo.freeSize)
    }

    async callResetKeyChain() {
        await new Promise(r => setTimeout(r, 5000))
        console.log("Reset keychain");
        alert("Reset keychain")
        await new Promise(r => setTimeout(r, 5000))
        await nfcCardModuleWrapper.resetKeyChain()
    }

}