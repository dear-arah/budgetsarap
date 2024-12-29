const {
  View,
  ScrollView,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
} = require('react-native');
import {useNavigation} from '@react-navigation/native';
import styles from './style';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useState} from 'react';
import axios from 'axios';
import { Alert } from 'react-native';


function SignUpPage() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [nameVerify, setNameVerify] = useState(false);
  const [email, setEmail] = useState('');
  const [emailVerify, setEmailVerify] = useState(false);
  const [mobile, setMobile] = useState('');
  const [mobileVerify, setMobileVerify] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit() {
    const userData = {
      name: name,
      email: email,
      mobile: mobile,
      password: password,
    };
  
    if (nameVerify && emailVerify && passwordVerify && mobileVerify) {
      axios
        .post('http://192.168.1.9:3000/register', userData)
        .then((res) => {
          console.log(res.data);
  
          if (res.data.status === "Ok") {
            Alert.alert("Success", "Registered Successfully!");
            navigation.navigate('Login');
          } else {
            Alert.alert("Error", JSON.stringify(res.data));
          }
        })
        .catch((e) => {
          console.error(e);
          Alert.alert("Error", "Failed to connect to the server.");
        });
    } else {
      Alert.alert("Error", "Please fill all fields correctly.");
    }
  }


  function handleNameChange(e){
   const nameVar=e.nativeEvent.text;
   setName(nameVar);
   setNameVerify(false);

   if (nameVar.length>1){
    setNameVerify(true);
   }
  }

  function handleEmail(e){
    const emailVar=e.nativeEvent.text;
    setEmail(emailVar);
    setEmailVerify(false);
 
    if (/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(emailVar)){
      setEmail(emailVar);
      setEmailVerify(true);
    }
   }

   function handleMobile(e){
    const mobileVar=e.nativeEvent.text;
    setMobile(mobileVar);
    setMobileVerify(false);
 
    if (/^[0-9]{11}$/.test(mobileVar)){
      setMobile(mobileVar);
      setMobileVerify(true);
    }
   }

   function handlePassword(e){
    const passwordVar=e.nativeEvent.text;
    setPassword(passwordVar);
    setPasswordVerify(false);
 
    if (/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(passwordVar)){
      setPassword(passwordVar);
      setPasswordVerify(true);
    }
   }

  return (
    <ScrollView
    keyboardShouldPersistTaps={true}>

    <View style={{backgroundColor: 'white'}}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require('../../assets/images/Qlogo.png')}
        />
      </View> 
      <View style={styles.loginContainer}>
        <Text style={styles.text_header}> Sign Up</Text>
        <View style={styles.action}>
          <TextInput placeholder="Full Name" style={styles.textInput} 
          onChange={e=>handleNameChange(e)}/>

          {name.length < 1 ? null : nameVerify ? (
            <Feather name="check-circle" color="green" style={styles.smallIcon} />
          ) : (
            <Feather name="check-circle" color="red" style={styles.smallIcon} />
          )}

        </View>

        {name.length < 1 ? null : nameVerify ? null : (
            <Text>
              Name should be atleast 2 characters.
            </Text>
          )}


        <View style={styles.action}>
          <TextInput placeholder="Email" style={styles.textInput}
          onChange={e=>handleEmail(e)}/>

          {email.length < 1 ? null : emailVerify ? (
            <Feather name="check-circle" color="green" style={styles.smallIcon} />
          ) : (
            <Feather name="check-circle" color="red" style={styles.smallIcon} />
          )}

        </View>
        
        {email.length < 1 ? null : emailVerify ? null : (
            <Text>
              Enter Proper Email Address.
            </Text>
        )}

        <View style={styles.action}>
          <TextInput placeholder="Mobile Number" style={styles.textInput} 
          onChange={e => handleMobile(e)}
          maxLength={11}
          />

          {mobile.length < 1 ? null : mobileVerify ? (
            <Feather name="check-circle" color="green" style={styles.smallIcon} />
          ) : (
            <Feather name="check-circle" color="red" style={styles.smallIcon} />
          )}

        </View>

        {mobile.length < 1 ? null : mobileVerify ? null: (
            <Text>
              Enter proper Mobile Number.
            </Text>
        )}


        <View style={styles.action}>
          <TextInput placeholder="Password" style={styles.textInput}
          onChange={e => handlePassword(e)}
          secureTextEntry={showPassword}
          />

          {/* Dito yung eye para sa passwords*/}
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <Feather 
              name="eye" 
              style={{ marginRight: 1, marginBottom: 10 }}
              color={'#d9d9d9'}
              size={23}
              />
            ) : (
              <Feather 
              name="eye-off" 
              style={{ marginRight: 1, marginBottom: 10 }}
              color={'#777777'}
              size={23}
              />
            )}
          </TouchableOpacity>
        </View>

        {password.length < 1 ? null : passwordVerify ? null: (
            <Text>
              Uppercase, Lowercase, Number and 6 more characters.
            </Text>
        )}

        <View
          style={{
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            marginTop: 8,
            marginRight: 10,
          }}>
        </View>
      </View>
      <View style={styles.button}>
        <TouchableOpacity style={styles.inBut}
        onPress={()=>handleSubmit()}>
          <View>
            <Text style={styles.textSign}>SignUp</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.inBut3}
        onPress={() => navigation.navigate('Login')}>
          <View>
            <Text style={styles.textSign2}>Login</Text>
          </View>
          <Feather name="arrow-right" color="#420475" style={styles.rightArrow} />
        </TouchableOpacity>
       
      </View>
    </View>
    </ScrollView>
  );
}
export default SignUpPage;