import { StyleSheet, Dimensions } from "react-native";

const windowHeight = Dimensions.get('window').height;

export const reportNavStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '90%',  
    height: windowHeight * 0.3,  
    justifyContent: 'center',
  },
  invButtonContainer: {
    flexDirection: 'row',
    width: '90%',  
    height: windowHeight * 0.2,  
    justifyContent: 'center',
    paddingBottom: 15,
  },
  button: {
    width: '45%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,  
    backgroundColor: '#000',
    marginHorizontal: 15
},
  invButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,  
    backgroundColor: '#000',
    marginHorizontal: 15
},
  buttonText: {
    fontSize: 24,  
    color: '#fff',
    backgroundColor: '#000',
    marginBottom: 15
  },
  reportIcon: {
    color: '#fff',
    fontSize: 50,
    marginTop: 25
  }
});
