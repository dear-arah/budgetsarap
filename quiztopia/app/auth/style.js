import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
  },
  headerContainer: {
    backgroundColor: '#240046', // Violet background
    height: 350, // Adjust to your desired height
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 10, // Rounded corners at the bottom
    borderBottomRightRadius: 10,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 70,
    borderBottomRightRadius: 70,
  },
  logo: {
    height: 150,
    width: 150,
  },
  loginContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginTop: -30, 
  },
  signupContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginTop: -30, // Pulls the signup container closer to the header
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
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
    borderWidth: 1,
    borderColor: '#420475',
    borderRadius: 50,
  },
  textSign2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#420475',
  },
});

export default styles;
