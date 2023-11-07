/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import nacl from "tweetnacl";
import React, {Component} from 'react';
import {
  Spacer,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Button,
  Text,
  TextInput,
  StatusBar,
  FlatList,
  Alert,
  DeviceEventEmitter,
  NativeEventEmitter
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  Style,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Dialog from "react-native-dialog";
import DialogInput from 'react-native-dialog-input';
import Ed25519Helper from "./Ed25519Helper";
import KeyChainHelper from "./KeyChainHelper";
import Toast from 'react-native-simple-toast';
import {NfcCardModuleWrapper, NfcNativeModuleError, CardResponse, CardError} from 'ton-nfc-client';

let  nfcCardModuleWrapper = new NfcCardModuleWrapper();

const findActivationDataPiece = require('./activationData')

function Separator() {
  return <View style={styles.separator}/>;
}




export default class HelloWorldApp extends Component {


  //static ed25519Helper;

  constructor(props) {
    super(props);
    this.state = {
      deviceLabel: '005815A3942073A6ADC70C035780FDD09DF09AFEEA4173B92FE559C34DCA0550',
      currentPin: '5555',
      data: '000000',
      newPin: '5555',
      hdIndex: '1',
      newKey: '0000',
      newKeyForChangeKey: '',
      keyIndex: '0',
      oldKeyIndex: '0',
      keyIndexToDelete: '0',
      msgLen: '100',
      numOfIter: '10',
      keyLen: '32',
      numberOfKeys: '3',
      keyLenForTestWithMultipleKeys: '8192',
      isGenerateSeedDialogVisible: false,
      isChangePinDialogVisible: false,
      isSetDeviceLabelDialogVisible: false,
      isGetPkDialogVisible: false,
      isVerifyPinDialogVisible: false,
      isSignForDefHdPathDialogVisible: false,
      isSignDialogVisible: false,
      enableScrollViewScroll: true,
      isSetKeyForHmacDialogVisible: false,
      isAddKeyIntoKeyChainDialogVisible: false,
      isGetKeyFromKeyChainDialogVisible: false,
      isChangeKeyFromKeyChainDialogVisible: false,
      isDeleteKeyFromKeyChainDialogVisible: false,
      isTurnOnWalletDialogVisible: false,
      isTestSignForLen32DialogVisible: false,
      isTestSignForMinLenDialogVisible: false,
      isTestSignForMaxLenDialogVisible: false,
      isTestSignDialogVisible: false,
      isTestSignForDefaultHdPathDialogVisible: false,
      isAddGetKeyDialogVisible: false,
      isMultipleAddGetKeyDialogVisible: false,
      isMultipleAddGetDeleteKeyDialogVisible: false,
      isTwoAddGetDeleteKeyDialogVisible: false,
      isMultipleAddGetChangeKeyDialogVisible: false,
      isDeleteKeyDialogVisible: false,
      keyData: [],
      serialNumber: "504394802433901126813236"
      /*serialNumbers: [
        "535110459474599149736332",
        "449634915078431948176852",
        "314856935569386969029165",
        "115456704932151001962551",
        "124843680472432549475921",
        "126083846606069739011949",
        "343155875629760788267343",
        "334525464436284236725680",
        "504394802433901126813236",
        "358464153630021949155797"
      ]*/
    };
    ed25519Helper = new Ed25519Helper(props);
    keyChainHelper = new KeyChainHelper(props);
  }

  printResults = (error, result) => {
    if (error != null) {
      alert("Error: " + error);
    } else {
      alert(result);
    }
  }

  showTestsDeleteKeyDialogVisible(isShow) {
    this.setState({isDeleteKeyDialogVisible: isShow})
  }

  showTestsMultipleAddGetChangeKeyDialogVisible(isShow) {
    this.setState({isMultipleAddGetChangeKeyDialogVisible: isShow})
  }

  showTestsTwoAddGetDeleteKeyDialogVisible(isShow) {
    this.setState({isTwoAddGetDeleteKeyDialogVisible: isShow})
  }

  showTestsMultipleAddGetDeleteKeyDialogVisible(isShow) {
    this.setState({isMultipleAddGetDeleteKeyDialogVisible: isShow})
  }

  showTestsMultipleAddGetKeyDialogVisible(isShow) {
    this.setState({isMultipleAddGetKeyDialogVisible: isShow})
  }

  showTestsAddGetKeyDialogVisible(isShow) {
    this.setState({isAddGetKeyDialogVisible: isShow})
  }

  showTestSignForMinLenDialogVisible(isShow) {
    this.setState({isTestSignForMinLenDialogVisible: isShow})
  }

  showTestSignForMaxLenDialogVisible(isShow) {
    this.setState({isTestSignForMaxLenDialogVisible: isShow})
  }

  showTestSignForLen32DialogVisible(isShow) {
    this.setState({isTestSignForLen32DialogVisible: isShow})
  }

  showTestSignDialogVisible(isShow) {
    this.setState({isTestSignDialogVisible: isShow})
  }

  showTestSignForDefaultHdPathDialogVisible(isShow) {
    this.setState({isTestSignForDefaultHdPathDialogVisible: isShow})
  }

  showSetKeyForHmacDialog(isShow) {
    this.setState({isSetKeyForHmacDialogVisible: isShow})
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

  render() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              style={styles.scrollView}>

              <Text style={{padding: 10, fontSize: 30}}>
                Setup app:
              </Text>
              <Separator/>
                <View>
                <Dialog.Container visible={this.state.isSetKeyForHmacDialogVisible}>
                  <Dialog.Title>Set key for hmac</Dialog.Title>
                  <Dialog.Input label="Serial number" style={{height: 70}}
                                defaultValue={this.state.serialNumber} multiline={true} numberOfLines={4}
                                onChangeText={(serialNumber) => this.setState({serialNumber})}></Dialog.Input>
                  <Dialog.Button label="Close" onPress={() => this.showSetKeyForHmacDialog(false)}/>
                  <Dialog.Button label="Submit" onPress={() => {
                    const data = findActivationDataPiece(this.state.serialNumber)
                    if (data === undefined ) {
                      alert("Serial number is not found.")
                    }
                    else {
                      console.log("data.P1 = " + data.P1)
                      console.log("data.CS = " + data.CS)
                      var authenticationPassword = data.P1
                      var commonSecret = data.CS
                      console.log("serialNumber = " + this.state.serialNumber)
                      nfcCardModuleWrapper.createKeyForHmac(authenticationPassword, commonSecret, this.state.serialNumber);
                    }
                    this.showSetKeyForHmacDialog(false)
                  }}/>
                </Dialog.Container>
              </View>
              <View>
                <Button onPress={() => this.showSetKeyForHmacDialog(true)} title="setKeyForHmac"/>
              </View>
            


              <Separator/>
              <Separator/>
              <View>
                <Button onPress={() => {nfcCardModuleWrapper.getPublicKeyForDefaultPath().then((res) => alert(res.message));}}
                        title="Get pk"/>
              </View>

              <Separator/>
              <Text style={{padding: 10, fontSize: 20}}>
                Number of iterations for testing signature:
              </Text>
              <Separator/>   
              <TextInput
                style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                onChangeText={(numOfIter) => this.setState({numOfIter})}
              value={this.state.numOfIter}
              />



              <Separator/>
              <Separator/>
              <Text style={{padding: 10, fontSize: 30}}>
                Tests for signWithDefaultPath:
              </Text>
              <Separator/>
              <Separator/>
              <View>
                <Button onPress={() => {ed25519Helper.testSignWithDefaultPathForMinLen(this.state.numOfIter);}}
                        title="Test signing random msg of min len (1 byte) for default hd path"/>
              </View>
              <Separator/>
              <Separator/>
              <View>
                <Button onPress={() => {ed25519Helper.testSignWithDefaultPathForMaxLen(this.state.numOfIter);}}
                        title="Test signing random msg of max len (189 bytes) for default hd path"/>
              </View>
              <Separator/>
              <Separator/>
              <View>
                <Button onPress={() => {ed25519Helper.testSignWithDefaultPathForLen32(this.state.numOfIter);}}
                        title="Test signing 32 bytes random hash for default hd path"/>
              </View>
              <Separator/>
              <Separator/>
              <View>
                <Dialog.Container visible={this.state.isTestSignForDefaultHdPathDialogVisible}>
                  <Dialog.Title>Test signing random messages for default hd path</Dialog.Title>
                  <Dialog.Input label="Message length (>0, <=189)" style={{height: 70}}
                                defaultValue={this.state.msgLen} multiline={true} numberOfLines={1}
                                onChangeText={(msgLen) => this.setState({msgLen})}></Dialog.Input>
                  <Dialog.Button label="Close" onPress={() => this.showTestSignForDefaultHdPathDialogVisible(false)}/>
                  <Dialog.Button label="Submit" onPress={() => {
                    ed25519Helper.testSignWithDefaultPath(this.state.numOfIter, 2 * parseInt(this.state.msgLen));
                    this.showTestSignForDefaultHdPathDialogVisible(false);
                  }}/>
                </Dialog.Container>
              </View>
              <View>
                <Button onPress={() => this.showTestSignForDefaultHdPathDialogVisible(true)} title="Test signing random messages for default hd path"/>
              </View>
              <Separator/>
              <Separator/>
              <View>
                <Button onPress={() => {ed25519Helper.testSignForDefaultHdPathWithIncorrectPin();}}
                        title="Test Sign For Default HD PATH With Incorrect Pin"/>
              </View>
              <Separator/>
              <Separator/>



              <Separator/>
              <Separator/>
              <Text style={{padding: 10, fontSize: 30}}>
                Tests for sign:
              </Text>
              <Separator/>
              <Separator/>
              <View style={styles.container}>
                <DialogInput isDialogVisible={this.state.isTestSignForLen32DialogVisible}
                             title={"Test signing 32 bytes random hash"}
                             message={"Enter hdIndex (0 <= number < 2147483647)"}
                             hintInput={"hdIndex..."}
                             submitInput={(hdIndex) => {
                               ed25519Helper.testSignForLen32(this.state.numOfIter, hdIndex);
                               this.showTestSignForLen32DialogVisible(false);
                             }}
                             closeDialog={() => this.showTestSignForLen32DialogVisible(false)}>
                </DialogInput>
              </View>
              <View>
                <Button onPress={() => this.showTestSignForLen32DialogVisible(true)}
                        title="Test signing 32 bytes random hash"/>
              </View>
              <Separator/>
              <Separator/>
              <View style={styles.container}>
                <DialogInput isDialogVisible={this.state.isTestSignForMinLenDialogVisible}
                             title={"Test signing random msg of min len (1 byte)"}
                             message={"Enter hdIndex (0 <= number < 2147483647)"}
                             hintInput={"hdIndex..."}
                             submitInput={(hdIndex) => {
                               ed25519Helper.testSignForMinLen(this.state.numOfIter, hdIndex);
                               this.showTestSignForMinLenDialogVisible(false);
                             }}
                             closeDialog={() => this.showTestSignForMinLenDialogVisible(false)}>
                </DialogInput>
              </View>
              <View>
                <Button onPress={() => this.showTestSignForMinLenDialogVisible(true)}
                        title="Test signing random msg of min len (1 byte)"/>
              </View>
              <Separator/>
              <Separator/>
              <View style={styles.container}>
                <DialogInput isDialogVisible={this.state.isTestSignForMaxLenDialogVisible}
                             title={"Test signing random msg of max len (178 bytes)"}
                             message={"Enter hdIndex (0 <= number < 2147483647)"}
                             hintInput={"hdIndex..."}
                             submitInput={(hdIndex) => {
                               ed25519Helper.testSignForMaxLen(this.state.numOfIter, hdIndex);
                               this.showTestSignForMaxLenDialogVisible(false);
                             }}
                             closeDialog={() => this.showTestSignForMaxLenDialogVisible(false)}>
                </DialogInput>
              </View>
              <View>
                <Button onPress={() => this.showTestSignForMaxLenDialogVisible(true)}
                        title="Test signing random msg of max len (178 bytes)"/>
              </View>
              <Separator/>
              <Separator/>
              <View>
                <Dialog.Container visible={this.state.isTestSignDialogVisible}>
                  <Dialog.Title>Test signing random messages</Dialog.Title>
                  <Dialog.Input label="hdIndex"
                                defaultValue={this.state.hdIndex} style={{height: 100}}
                                multiline={true} numberOfLines={1}
                                onChangeText={(hdIndex) => this.setState({hdIndex})}></Dialog.Input>
                  <Dialog.Input label="Message length (>0, <=178)" style={{height: 70}}
                                defaultValue={this.state.msgLen} multiline={true} numberOfLines={1}
                                onChangeText={(msgLen) => this.setState({msgLen})}></Dialog.Input>
                  <Dialog.Button label="Close" onPress={() => this.showTestSignDialogVisible(false)}/>
                  <Dialog.Button label="Submit" onPress={() => {
                    ed25519Helper.testSign(this.state.numOfIter, 2 * parseInt(this.state.msgLen), this.state.hdIndex);
                    this.showTestSignDialogVisible(false);
                  }}/>
                </Dialog.Container>
              </View>
              <View>
                <Button onPress={() => this.showTestSignDialogVisible(true)} title="Test signing random messages"/>
              </View>
              <Separator/>
              <View>
                <Button onPress={() => {ed25519Helper.testSignWithIncorrectPin();}}
                        title="Test Sign With Incorrect Pin"/>
              </View>
              <Separator/>
              <Separator/>

              <Separator/>
              <Separator/>
              <Text style={{padding: 10, fontSize: 30}}>
                Tests for keychain:
              </Text>
              <Separator/>
              <Separator/>
              <View>
              <Button onPress={() => {
                keyChainHelper.resetKeyChain();
              }} title="Reset KeyChain"/>
             </View>
             <Separator/>
              <Separator/>
              <View>
              <Button onPress={() => {
                keyChainHelper.getAndPrintKeyChainInfo();
              }} title="Get KeyChainInfo"/>
             </View>
             <Separator/>
              <Separator/>
              <Text style={{padding: 10, fontSize: 20}}>
                Tests add+get:
              </Text>
              <Separator/>
              <Separator/>  
               <View>
                <Dialog.Container visible={this.state.isMultipleAddGetKeyDialogVisible}>
                  <Dialog.Title>Test add/get multiple keys</Dialog.Title>
                  <Dialog.Input label="Key length (>0, <=8192)" style={{height: 70}}
                                defaultValue={this.state.keyLenForTestWithMultipleKeys} multiline={true} numberOfLines={1}
                                onChangeText={(keyLenForTestWithMultipleKeys) => this.setState({keyLenForTestWithMultipleKeys})}></Dialog.Input>
                   <Dialog.Input label="Number of keys " style={{height: 70}}
                                defaultValue={this.state.numberOfKeys} multiline={true} numberOfLines={1}
                                onChangeText={(numberOfKeys) => this.setState({numberOfKeys})}></Dialog.Input>             
                  <Dialog.Button label="Close" onPress={() => this.showTestsMultipleAddGetKeyDialogVisible(false)}/>
                  <Dialog.Button label="Submit" onPress={() => {
                    let total = this.state.keyLenForTestWithMultipleKeys * this.state.numberOfKeys
                    console.log("total keys length = "+ total)
                    if (total > 32767 ) {
                      console.log("Total size of keys must not exceed 32767 bytes.")
                      alert("Total size of keys must not exceed 32767 bytes.")
                    }
                    else {
                      keyChainHelper.testAddGetMultipleKey(this.state.keyLenForTestWithMultipleKeys, this.state.numberOfKeys);
                    }
                    this.showTestsMultipleAddGetKeyDialogVisible(false);
                  }}/>
                </Dialog.Container>
              </View>
              <View>
                <Button onPress={() => this.showTestsMultipleAddGetKeyDialogVisible(true)} title="Test add/get multiple keys"/>
              </View>
              <Separator/>
              <Separator/> 

              <Text style={{padding: 10, fontSize: 20}}>
                Tests add+get+delete:
              </Text>  
        
              <Separator/>
              <Separator/>
              <View>
                <Button onPress={() => {keyChainHelper.testAddGetDeleteOneKeyOfMaxLen();}}
                        title="Test add/delete/get one key of max length (8192 bytes)"/>
              </View>
              <Separator/>
              <Separator/>

              <View>
                <Dialog.Container visible={this.state.isMultipleAddGetDeleteKeyDialogVisible}>
                  <Dialog.Title>Test add/get/delete multiple keys of the same length:</Dialog.Title>
                  <Dialog.Input label="Key length (>0, <=8192)" style={{height: 70}}
                                defaultValue={this.state.keyLenForTestWithMultipleKeys} multiline={true} numberOfLines={1}
                                onChangeText={(keyLenForTestWithMultipleKeys) => this.setState({keyLenForTestWithMultipleKeys})}></Dialog.Input>
                   <Dialog.Input label="Number of keys " style={{height: 70}}
                                defaultValue={this.state.numberOfKeys} multiline={true} numberOfLines={1}
                                onChangeText={(numberOfKeys) => this.setState({numberOfKeys})}></Dialog.Input>             
                  <Dialog.Button label="Close" onPress={() => this.showTestsMultipleAddGetDeleteKeyDialogVisible(false)}/>
                  <Dialog.Button label="Submit" onPress={() => {
                    let total = this.state.keyLenForTestWithMultipleKeys * this.state.numberOfKeys
                    console.log("total keys length = "+ total)
                    if (total > 32767 ) {
                      console.log("Total size of keys must not exceed 32767 bytes.")
                      alert("Total size of keys must not exceed 32767 bytes.")
                    }
                    else {
                      keyChainHelper.testAddGetDeleteMultipleKey(this.state.keyLenForTestWithMultipleKeys, this.state.numberOfKeys);
                    }
                    this.showTestsMultipleAddGetDeleteKeyDialogVisible(false);
                  }}/>
                </Dialog.Container>
              </View>
              <View>
                <Button onPress={() => this.showTestsMultipleAddGetDeleteKeyDialogVisible(true)} title="Test add/get/delete multiple keys"/>
              </View>

              <Separator/>
              <Separator/>
              
              <View>
                <Dialog.Container visible={this.state.isTwoAddGetDeleteKeyDialogVisible}>
                  <Dialog.Title>Test add/get/delete two keys (first key of len = 1, for second you specify length below: )</Dialog.Title>
                  <Dialog.Input label="Key length (>0, <=8192)" style={{height: 70}}
                                defaultValue={this.state.keyLenForTestWithMultipleKeys} multiline={true} numberOfLines={1}
                                onChangeText={(keyLenForTestWithMultipleKeys) => this.setState({keyLenForTestWithMultipleKeys})}></Dialog.Input>           
                  <Dialog.Button label="Close" onPress={() => this.showTestsTwoAddGetDeleteKeyDialogVisible(false)}/>
                  <Dialog.Button label="Submit" onPress={() => {
                      keyChainHelper.testAddGetDeleteTwoKeys(this.state.keyLenForTestWithMultipleKeys);
                  }}/>
                </Dialog.Container>
              </View>
              <View>
                <Button onPress={() => this.showTestsTwoAddGetDeleteKeyDialogVisible(true)} title="Test add/get/delete two keys"/>
              </View>

              <Separator/>
              <Separator/> 

              <View>
                <Button onPress={() => {keyChainHelper.testDeleteForMaxNumOfKeys();}}
                        title="Test delete two keys (you must add multiple keys before this test)"/>
              </View>

              <Separator/>
              <Separator/> 
              
              <Text style={{padding: 10, fontSize: 20}}>
                Tests add+get+change:
              </Text> 
              
              <Separator/>
              <Separator/> 
              <View>
                <Dialog.Container visible={this.state.isMultipleAddGetChangeKeyDialogVisible}>
                  <Dialog.Title>Test add/get/change multiple keys</Dialog.Title>
                  <Dialog.Input label="Key length (>0, <=8192)" style={{height: 70}}
                                defaultValue={this.state.keyLenForTestWithMultipleKeys} multiline={true} numberOfLines={1}
                                onChangeText={(keyLenForTestWithMultipleKeys) => this.setState({keyLenForTestWithMultipleKeys})}></Dialog.Input>
                   <Dialog.Input label="Number of keys " style={{height: 70}}
                                defaultValue={this.state.numberOfKeys} multiline={true} numberOfLines={1}
                                onChangeText={(numberOfKeys) => this.setState({numberOfKeys})}></Dialog.Input>             
                  <Dialog.Button label="Close" onPress={() => this.showTestsMultipleAddGetChangeKeyDialogVisible(false)}/>
                  <Dialog.Button label="Submit" onPress={() => {
                    let total = this.state.keyLenForTestWithMultipleKeys * this.state.numberOfKeys
                    console.log("total keys length = "+ total)
                    if (total > 32767 ) {
                      console.log("Total size of keys must not exceed 32767 bytes.")
                      alert("Total size of keys must not exceed 32767 bytes.")
                    }
                    else {
                      keyChainHelper.testAddGetChangeMultipleKey(this.state.keyLenForTestWithMultipleKeys, this.state.numberOfKeys);
                    }
                    this.showTestsMultipleAddGetChangeKeyDialogVisible(false);
                  }}/>
                </Dialog.Container>
              </View>
              <View>
                <Button onPress={() => this.showTestsMultipleAddGetChangeKeyDialogVisible(true)} title="Test add/get/Change multiple keys"/>
              </View>
              <Separator/>
              <Separator/> 
              <View>
                <Button onPress={() => {keyChainHelper.testAddChangeGetOneKey();}}
                        title="Test add/change/get one key"/>
              </View>
              
          </ScrollView>
        </SafeAreaView>

    );
  }
}



const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  container: {
    flex: 1,
    marginHorizontal: 16,
  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
