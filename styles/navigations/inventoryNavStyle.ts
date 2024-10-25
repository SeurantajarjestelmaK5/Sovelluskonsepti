import { StyleSheet, Dimensions } from "react-native";

const windowHeight = Dimensions.get('window').height;

export const invNavStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  buttonContainer: {
    width: '70%',  
    height: windowHeight * 0.3,  
    marginVertical: 30,  
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  button: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,  
    backgroundColor: '#000',
  },
  buttonText: {
    fontSize: 24,  
    color: '#fff',
    backgroundColor: '#000',
    marginBottom: 15
  },
  inventoryIcon: {
    color: '#fff',
    fontSize: 50,
    paddingTop: 25
  }
});
