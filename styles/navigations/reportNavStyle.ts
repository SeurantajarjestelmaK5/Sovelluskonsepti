import { StyleSheet, Dimensions } from "react-native";
import { ThemeColors } from "@/constants/ThemeColors";
const windowHeight = Dimensions.get('window').height;

export const getReportNavStyle = (ThemeColors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 16,
    backgroundColor: ThemeColors.background,
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
    backgroundColor: ThemeColors.button,
    marginHorizontal: 15
},
  invButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,  
    backgroundColor: ThemeColors.button,
    marginHorizontal: 15
},
  buttonText: {
    fontSize: 24,  
    color: ThemeColors.text,
    marginBottom: 15
  },
  reportIcon: {
    color: ThemeColors.tabIconSelected,
    fontSize: 50,
    marginTop: 25
  }
});
