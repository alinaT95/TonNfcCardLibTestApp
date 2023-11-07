import React from 'react';
import nacl from "tweetnacl";
import HexHelper from "./HexHelper";
import {NfcCardModuleWrapper, NfcNativeModuleError, CardResponse, CardError} from 'ton-nfc-client';

let  nfcCardModuleWrapper = new NfcCardModuleWrapper();

export default class Ed25519Helper {
    static DOUBLE_DATA_FOR_SIGNING_MIN_LEN = 2;
    static DOUBLE_DATA_FOR_SIGNING_MAX_SIZE_FOR_CASE_WITH_PATH = 2 * 178;
    static DOUBLE_DATA_FOR_SIGNING_MAX_SIZE = 2 * 189;
    static DOUBLE_TON_TRANSACTION_HASH_LEN = 64;
    static DEFAULT_NUM_OF_TEST_ITERATIONS = 10;//1000;
    static MAX_PIN_TRIES = 10;
    static DEFAULT_PIN = "5555";
    static INCORRECT_PIN = "6666";
    static SW_INCORRECT_PIN = "(6f07)";
    static SW_PIN_TRIES_EXPIRED = "(6f08)";
    static PIN_VERIFICATION_NOT_FAILED_ERROR = "Pin verification had to fail, but it had NOT.";

    async testSignWithDefaultPathForLen32(numOfIter) {
        this.testSignWithDefaultPath(numOfIter, Ed25519Helper.DOUBLE_TON_TRANSACTION_HASH_LEN )
    }

    async testSignWithDefaultPathForMinLen(numOfIter) {
        this.testSignWithDefaultPath(numOfIter, Ed25519Helper.DOUBLE_DATA_FOR_SIGNING_MIN_LEN )
    }

    async testSignWithDefaultPathForMaxLen(numOfIter) {
        this.testSignWithDefaultPath(numOfIter, Ed25519Helper.DOUBLE_DATA_FOR_SIGNING_MAX_SIZE)
    }

    async testSignForLen32(numOfIter, hdIndex) {
        this.testSign(numOfIter, Ed25519Helper.DOUBLE_TON_TRANSACTION_HASH_LEN, hdIndex )
    }

    async testSignForMinLen(numOfIter, hdIndex) {
        this.testSign(numOfIter, Ed25519Helper.DOUBLE_DATA_FOR_SIGNING_MIN_LEN, hdIndex )
    }

    async testSignForMaxLen(numOfIter, hdIndex) {
        this.testSign(numOfIter, Ed25519Helper.DOUBLE_DATA_FOR_SIGNING_MAX_SIZE_FOR_CASE_WITH_PATH, hdIndex )
    }

    async testSignWithDefaultPath(numOfIter, msgLen) {
        var promise = Promise.resolve("");
        var numberOfPassedTests = 0;
       
        for (let i = 0; i < numOfIter; i++) {
            let msg = HexHelper.genHexString(msgLen);
            var signature;
            var startTime;
            promise = promise
                .then( async  (result) => {
                    await new Promise(r => setTimeout(r, 5000))
                    startTime = performance.now();
                    return nfcCardModuleWrapper.verifyPinAndSignForDefaultHdPath(msg, Ed25519Helper.DEFAULT_PIN)
                })
                .then( async (response) => {
                    let sig = response.message;
                    var endTime = performance.now();
                    var timeDiff = endTime - startTime; //in ms
                    console.log("-------------------------------------");
                    console.log("-------------------------------------");
                    console.log("Test #" + i);
                    console.log("Message : " + msg);
                    console.log("Signature : " + sig);
                    console.log("Elapsed time: " + timeDiff + " milli seconds");
                    alert("Test #" + i + "\n" +
                        "Message : " + msg + "\n" +
                        "Signature : " + sig + "\n" +
                        "Elapsed time: " + timeDiff + " milli seconds" + "\n" +
                        "Requesting pk..."
                    )
                    signature = sig;
                    await new Promise(r => setTimeout(r, 5000))
                    return nfcCardModuleWrapper.getPublicKeyForDefaultPath()
                })
                .then( (response) => {
                    let pubKey = response.message;
                    console.log("Public key : " + pubKey);
                    let msgBytes = HexHelper.hexStringToByteArray(msg);
                    let signatureBytes = HexHelper.hexStringToByteArray(signature);
                    let pkBytes = HexHelper.hexStringToByteArray(pubKey);
                    let sigVerificationRes = nacl.sign.detached.verify(msgBytes, signatureBytes, pkBytes);
                    if (sigVerificationRes == false) {
                        throw new Error("Signature is not correct. Test #" + i + " failed.");
                    }
                    numberOfPassedTests++;
                    console.log("Signature correctness : " + sigVerificationRes);
                    alert("Signature correctness : " + sigVerificationRes);
                    console.log("-------------------------------------");
                    console.log("-------------------------------------");
                })

        }
        promise.then( async (result) => {
            console.log("Success! All tests are passed.");
            await new Promise(r => setTimeout(r, 5000))
            alert("Success! All tests are passed.");
        }).catch( async (e) => {
            await new Promise(r => setTimeout(r, 5000))
            alert(e.message)
            console.log("Error happened : " + e.message);
        }).finally( async () => {
            await new Promise(r => setTimeout(r, 5000))
            alert(numberOfPassedTests + "/" + numOfIter + " tests are passed")
            console.log(numberOfPassedTests + "/" + numOfIter + " tests are passed");
        })
    }

    async testSign(numOfIter, msgLen, hdIndex) {
        console.log("hdIndex : " + hdIndex);
        var promise = Promise.resolve("");
        var numberOfPassedTests = 0;
        for (let i = 0; i < numOfIter; i++) {
            let msg = HexHelper.genHexString(msgLen);
            var signature;
            var startTime;
            promise = promise
                .then( async  (result) => {
                    await new Promise(r => setTimeout(r, 5000))
                    startTime = performance.now();
                    return nfcCardModuleWrapper.verifyPinAndSign(msg, hdIndex, Ed25519Helper.DEFAULT_PIN)
                })
                .then( async (response) => {
                    let sig = response.message;
                    var endTime = performance.now();
                    var timeDiff = endTime - startTime; //in ms
                    console.log("-------------------------------------");
                    console.log("-------------------------------------");
                    console.log("Test #" + i);
                    console.log("Message : " + msg);
                    console.log("Signature : " + sig);
                    console.log("Elapsed time: " + timeDiff + " milli seconds");
                    alert("Test #" + i + "\n" +
                        "Message : " + msg + "\n" +
                        "Signature : " + sig + "\n" +
                        "Elapsed time: " + timeDiff + " milli seconds" + "\n" +
                        "Requesting pk..."
                    )
                    signature = sig;
                    await new Promise(r => setTimeout(r, 5000))
                    return nfcCardModuleWrapper.getPublicKey(hdIndex)
                })
                .then( (response) => {
                    let pubKey = response.message;
                    console.log("Public key : " + pubKey);
                    let msgBytes = HexHelper.hexStringToByteArray(msg);
                    let signatureBytes = HexHelper.hexStringToByteArray(signature);
                    let pkBytes = HexHelper.hexStringToByteArray(pubKey);
                    let sigVerificationRes = nacl.sign.detached.verify(msgBytes, signatureBytes, pkBytes);
                    if (sigVerificationRes == false) {
                        throw new Error("Signature is not correct. Test #" + i + " failed.");
                    }
                    numberOfPassedTests++;
                    console.log("Signature correctness : " + sigVerificationRes);
                    alert("Signature correctness : " + sigVerificationRes);
                    console.log("-------------------------------------");
                    console.log("-------------------------------------");
                })

        }
        promise.then( async (result) => {
            await new Promise(r => setTimeout(r, 5000))
            console.log("Success! All tests are passed.");
            alert("Success! All tests are passed.");
        }).catch( async (e) => {
            await new Promise(r => setTimeout(r, 5000))
            alert(e.message)
            console.log("Error happened : " + e.message);
        }).finally(async () => {
            await new Promise(r => setTimeout(r, 5000))
            alert(numberOfPassedTests + "/" + numOfIter + " tests are passed")
            console.log(numberOfPassedTests + "/" + numOfIter + " tests are passed");
        })
    }

    async testSignWithIncorrectPin() {
        let hdIndex = "22";
        let msg = "00";
        var promise = Promise.resolve("").then(async (result) => {
            await new Promise(r => setTimeout(r, 5000))
            return nfcCardModuleWrapper.verifyPinAndSign(msg, hdIndex, Ed25519Helper.DEFAULT_PIN);
            
        }).then( async(result) => {
            await new Promise(r => setTimeout(r, 5000))
            return nfcCardModuleWrapper.verifyPinAndSign(msg, hdIndex, Ed25519Helper.INCORRECT_PIN);
        })
        for (let i = 0; i < Ed25519Helper.MAX_PIN_TRIES - 1; i++) {
            promise = promise
                .then((result) => {
                    throw new Error(i + "-th iteration of test failed : " + Ed25519Helper.PIN_VERIFICATION_NOT_FAILED_ERROR);
                })
                .catch( async (e) => {
                    if (e.message.includes(Ed25519Helper.PIN_VERIFICATION_NOT_FAILED_ERROR))   {
                        throw e;
                    }
                    console.log("Success: expected " + i +
                        "-th pin verification fail happened with status word : " + e.message);
                    alert("Success: expected " + i +
                        "-th pin verification fail happened with status word : " + e.message);   
                    await new Promise(r => setTimeout(r, 5000))
                    return nfcCardModuleWrapper.verifyPinAndSign(msg, hdIndex, Ed25519Helper.INCORRECT_PIN);
                })
        }
        promise
            .then((result) => {
                throw new Error( (Ed25519Helper.MAX_PIN_TRIES-1) + "-th iteration of test failed : " + Ed25519Helper.PIN_VERIFICATION_NOT_FAILED_ERROR);
            })
            .catch( async (e) => {
                if (e.message.includes(Ed25519Helper.PIN_VERIFICATION_NOT_FAILED_ERROR))   {
                    throw e;
                }
                console.log("Success: expected " + (Ed25519Helper.MAX_PIN_TRIES-1) + "-th pin verification fail happened with status word : " + e.message);
                alert("Success: expected " + (Ed25519Helper.MAX_PIN_TRIES-1) + "-th pin verification fail happened with status word : " + e.message);
                await new Promise(r => setTimeout(r, 5000))
                return nfcCardModuleWrapper.verifyPinAndSign(msg, hdIndex, Ed25519Helper.DEFAULT_PIN);
            })
            .then((result) => {
                throw new Error("Last iteration of test failed : " + Ed25519Helper.PIN_VERIFICATION_NOT_FAILED_ERROR);
            })
            .catch((e) => {
                if (e.message.toLowerCase().includes(Ed25519Helper.SW_INCORRECT_PIN)
                    || e.message.toLowerCase().includes(Ed25519Helper.SW_PIN_TRIES_EXPIRED)) {
                    alert("Success: expected last pin verification fail happened with correct card status word : " + e.message);
                    console.log("Success: expected last pin verification fail happened with correct card status word : " + e.message);
                }
                else {
                    alert("Error : " + e.message);
                    console.log("Error : " + e.message);
                }
                return nfcCardModuleWrapper.resetWallet();
            })
            .then( async (result) => {
                await new Promise(r => setTimeout(r, 5000))
                console.log("Reset wallet response: " + result.message);
                alert("Reset wallet response: " + result.message);
                await new Promise(r => setTimeout(r, 5000))
                return nfcCardModuleWrapper.generateSeed(Ed25519Helper.DEFAULT_PIN);
            })
            .then( async (result) => {
                await new Promise(r => setTimeout(r, 5000))
                console.log("Generate seed response: " + result.message);
                alert("Generate seed response: " + result.message);
                await new Promise(r => setTimeout(r, 5000))
                alert("Test is passed!");
            })
            .catch( async (e) => {
                await new Promise(r => setTimeout(r, 5000))
                alert("Error happened : " + e.message);
                console.log("Error happened : " + e.message);
            })
    }

    async testSignForDefaultHdPathWithIncorrectPin() {
        let msg = "0000";
        var promise = Promise.resolve("").then( async (result) => {
            await new Promise(r => setTimeout(r, 5000))
            return nfcCardModuleWrapper.verifyPinAndSignForDefaultHdPath(msg, Ed25519Helper.DEFAULT_PIN);
        }).then( async (result) => {
            await new Promise(r => setTimeout(r, 5000))
            return nfcCardModuleWrapper.verifyPinAndSignForDefaultHdPath(msg, Ed25519Helper.INCORRECT_PIN);
        })
        for (let i = 0; i < Ed25519Helper.MAX_PIN_TRIES - 1; i++) {
            promise = promise
                .then((result) => {
                    throw new Error(i + "-th iteration of test failed : " + Ed25519Helper.PIN_VERIFICATION_NOT_FAILED_ERROR);
                })
                .catch( async (e) => {
                    if (e.message.includes(Ed25519Helper.PIN_VERIFICATION_NOT_FAILED_ERROR)) {
                        throw e;
                    }
                    console.log("Success: expected " + i +
                        "-th pin verification fail happened with status word : " + e.message);
                    alert("Success: expected " + i +
                        "-th pin verification fail happened with status word : " + e.message)   
                    await new Promise(r => setTimeout(r, 5000))   
                    return nfcCardModuleWrapper.verifyPinAndSignForDefaultHdPath(msg, Ed25519Helper.INCORRECT_PIN);
                })
        }
        promise
            .then((result) => {
                throw new Error((Ed25519Helper.MAX_PIN_TRIES - 1) + "-th iteration of test failed : " + Ed25519Helper.PIN_VERIFICATION_NOT_FAILED_ERROR);
            })
            .catch( async (e) => {
                if (e.message.includes(Ed25519Helper.PIN_VERIFICATION_NOT_FAILED_ERROR)) {
                    throw e;
                }
                console.log("Success: expected " + (Ed25519Helper.MAX_PIN_TRIES - 1) + "-th pin verification fail happened with status word : " + e.message);
                alert("Success: expected " + (Ed25519Helper.MAX_PIN_TRIES - 1) + "-th pin verification fail happened with status word : " + e.message);
                await new Promise(r => setTimeout(r, 5000))
                return nfcCardModuleWrapper.verifyPinAndSignForDefaultHdPath(msg, Ed25519Helper.DEFAULT_PIN);
            })
            .then((result) => {
                throw new Error("Last iteration of test failed : " + Ed25519Helper.PIN_VERIFICATION_NOT_FAILED_ERROR);
            })
            .catch( async (e) => {
                if (e.message.toLowerCase().includes(Ed25519Helper.SW_INCORRECT_PIN)
                    || e.message.toLowerCase().includes(Ed25519Helper.SW_PIN_TRIES_EXPIRED)) {
                    alert("Success: expected last pin verification fail happened with correct card status word : " + e.message);
                    console.log("Success: expected last pin verification fail happened with correct card status word : " + e.message);
                } else {
                    alert("Error : " + e.message);
                    console.log("Error : " + e.message);
                }
                await new Promise(r => setTimeout(r, 5000))
                return nfcCardModuleWrapper.resetWallet();
            })
            .then(async (result) => {
                console.log("Reset wallet response: " + result.message);
                alert("Reset wallet response: " + result.message);
                await new Promise(r => setTimeout(r, 5000))
                return nfcCardModuleWrapper.generateSeed(Ed25519Helper.DEFAULT_PIN);
            })
            .then( async (result) => {
                console.log("Generate seed response: " + result.message);
                alert("Generate seed response: " + result.message);
                await new Promise(r => setTimeout(r, 5000))
                alert("Test is passed!");
            })
            .catch((e) => {
                alert("Error happened : " + e.message)
                console.log("Error happened : " + e.message);
            })
    }

}