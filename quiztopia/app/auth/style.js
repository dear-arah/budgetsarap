import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#240046',
  },
  headerContainer: {
    backgroundColor: '#240046', // Violet background
    height: 300, // Adjust to your desired height
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  signuplogoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -70,
  },
  logo: {
    height: 100,
    width: 100,
  },
  loginContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginTop: -20, 
    height: '100%',
  },
  signupContainer: {
    backgroundColor: '#fff',
    height: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginTop: -90, // Pulls the signup container closer to the header
    borderWidth: 1, // Optional: Add a border for distinction
    borderColor: '#eee', 
  },
  text_header: {
    color: '#420475',
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 20,
  },
  action: {
    flexDirection: 'row',
    paddingTop: 14,
    paddingBottom: 3,
    marginTop: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#420475',
    borderRadius: 50,
  },
  textInput: {
    flex: 1,
    marginTop: -12,
    color: '#05375a',
  },
  button: {
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
  },
  inBut: {
    width: '90%',
    backgroundColor: '#420475',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 50,
    shadowColor: '#000',
    elevation: 4,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  inBut3: {
    marginTop: 10,
    backgroundColor: '#fff',
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    elevation: 6,
  },
  textSign2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#420475',
  },
  smallIcon:{
    marginRight: 2,
  },
  rightArrow:{
    marginLeft: 4,
  },
});

export default styles;
