import { StyleSheet, Dimensions } from "react-native";

const windowHeight = Dimensions.get('window').height;

export const diningroomStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  headerContainer: {  
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '90%',  
    height: windowHeight * 0.3,  
    marginVertical: 30,  
    justifyContent: 'center',
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
  buttonText: {
    fontSize: 24,  
    color: '#fff',
    backgroundColor: '#000',
    marginTop: 15
  },
  dateText: {
    fontSize: 24,  
    color: '#000',
    fontWeight: 'bold',
    paddingLeft: 5
  }, 
  backIcon: {
    fontSize: 50,
    marginLeft: '80%'
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'condensedBold',
    alignSelf: 'center',
    marginTop: 15
  },
  oneBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 'auto',
    backgroundColor: '#626570',
    borderRadius: 20,
    marginTop: 20
  }
});
