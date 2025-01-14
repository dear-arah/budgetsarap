const {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} = require('react-native');
import {useNavigation} from '@react-navigation/native';
import styles from './style';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

function LoginPage() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit() {
    const userData = { email, password };

    axios
        .post("http://192.168.1.9:3000/login-user", userData)
        .then((res) => {
            console.log(res.data);
            if (res.data.status === "ok") {
              const email = userData.email;
              AsyncStorage.setItem('userEmail', email) // Save email instead of token
                .then(() => {
                  console.log('Email saved');
                })
                .catch((err) => {
                  console.error('Error saving email:', err);
                });
                Alert.alert("Logged In Successfully!");
                navigation.navigate("Tabs");
            } else {
                Alert.alert("Login Failed", res.data.data || "Something went wrong.");
            }
        })
        .catch((err) => {
            console.error(err);
            Alert.alert("Login Failed", "Unable to log in. Please try again later.");
        });
    }

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps={"always"}>
    <View style={{backgroundColor: 'white'}}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require('../../assets/images/Qlogo.png')}
        />
      </View>
      <View style={styles.loginContainer}>
        <Text style={styles.text_header}>Login</Text>
        <View style={styles.action}>
          <FontAwesome name="user-o" color="#420475" style={styles.smallIcon} />
          <TextInput placeholder="Mobile or Email" style={styles.textInput} onChange={e => setEmail(e.nativeEvent.text)} />
        </View>
        <View style={styles.action}>
          <FontAwesome name="lock" color="#420475" style={styles.smallIcon} />
          <TextInput placeholder="Password" style={styles.textInput} onChange={e => setPassword(e.nativeEvent.text)} />
        </View>
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
        <TouchableOpacity style={styles.inBut} onPress={()=>handleSubmit()}>
          <View>
            <Text style={styles.textSign}>Log in</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.inBut3}
        onPress={() => navigation.navigate('SignUp')}>
          <View>
            <Text style={styles.textSign2}>SignUp</Text>
          </View>
          <Feather name="arrow-right" color="#420475" style={styles.rightArrow} />
        </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
  );
}
export default LoginPage;