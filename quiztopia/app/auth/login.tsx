const {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} = require("react-native");
import { useNavigation } from "@react-navigation/native";
import styles from "./style";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useState } from "react";
import axios from "axios";

function LoginPage() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit() {
    const userData = { email, password };

    axios
      .post("http://192.168.1.6:3000/login-user", userData)
      .then((res) => {
        console.log(res.data);
        if (res.data.status === "ok") {
          Alert.alert("Logged In Successfully!");
          navigation.navigate("Tabs");
        } else {
          Alert.alert(
            "Login Failed",
            res.data.data || "Something went wrong."
          );
        }
      })
      .catch((err) => {
        console.error(err);
        Alert.alert(
          "Login Failed",
          "Unable to log in. Please try again later."
        );
      });
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps={"always"}
    >
      <View style={styles.mainContainer}>
        {/* Violet Header */}
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require("../../assets/images/Qlogo.png")}
            />
          </View>
        </View>

        {/* Login Form */}
        <View style={styles.loginContainer}>
          <Text style={styles.text_header}>Login</Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" color="#420475" style={styles.smallIcon} />
            <TextInput
              placeholder="Mobile or Email"
              style={styles.textInput}
              onChange={(e) => setEmail(e.nativeEvent.text)}
            />
          </View>
          <View style={styles.action}>
            <FontAwesome name="lock" color="#420475" style={styles.smallIcon} />
            <TextInput
              placeholder="Password"
              style={styles.textInput}
              onChange={(e) => setPassword(e.nativeEvent.text)}
            />
          </View>
        </View>

        {/* Buttons */}
        </View>
      <View style={styles.button}>
        <TouchableOpacity style={styles.inBut} onPress={()=>handleSubmit()}>
          <View>
            <Text style={styles.textSign}>Log in</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.inBut3}
        onPress={() => navigation.navigate('SignUp')}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.textSign2}>Sign Up</Text>
              <Feather name="arrow-right" color="#420475" style={styles.rightArrow} />
            </View>
          
        </TouchableOpacity>
    </View>
    </ScrollView>
  );
}
export default LoginPage;