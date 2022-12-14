// yarn add react-native-fbsdk

import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk';

const App = () => {
  const [userInfo, setUserInfo] = useState({});

  const logoutWithFacebook = () => {
    LoginManager.logOut();
    setUserInfo({});
  };

  const getInfoFromToken = token => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'id,name,first_name,last_name',
      },
    };

    const profileRequest = new GraphRequest(
      '/me',
      {token, parameters: PROFILE_REQUEST_PARAMS},
      (error, user) => {
        if (error) {
          console.log('login info has error: ' + error);
        } else {
          console.log('USER INFO====>', user);
          setUserInfo(user);
        }
      },
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };

  const loginWithFacebook = () => {
    LoginManager.logInWithPermissions(['public_profile']).then(
      login => {
        if (login.isCancelled) {
          console.log('Login cancelled');
          alert('Login Cancelled');
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            const accessToken = data.accessToken.toString();
            console.log('ACCESS TOKEN====>', accessToken);
            getInfoFromToken(accessToken);
          });
        }
      },
      error => {
        console.log('Login Fail With ERROR====>', error);
      },
    );
  };

  return (
    <View style={{flex: 1, margin: 30}}>
      {!userInfo.name ? (
        <TouchableOpacity
          onPress={() => loginWithFacebook()}
          style={{
            backgroundColor: '#4173c9',
            padding: 16,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 50,
          }}>
          <Text style={{color: 'white'}}>Login with Facebook</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => logoutWithFacebook()}
          style={{
            marginTop: 50,
            backgroundColor: 'red',
            padding: 16,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 50,
          }}>
          <Text style={{color: 'white'}}>Logout with Facebook</Text>
        </TouchableOpacity>
      )}

      <View
        style={{
          width: '90%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 20,
            marginVertical: 16,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          Logged in As {userInfo.name}
        </Text>
        <Text> Login ID: {userInfo.id} </Text>
      </View>
    </View>
  );
};

export default App;
