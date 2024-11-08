import { StyleSheet, Dimensions } from "react-native";

const windowHeight = Dimensions.get('window').height;

export const diningroomStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 5,
    backgroundColor: '#fff'
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
    paddingLeft: 5,
    flex: 1,
  },
  backIcon: {
    fontSize: 25,
  },
  calendarIcon: {
    fontSize: 25,
    color: "#000",
    paddingRight: 10,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 15
  },
  oneBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    height: 60,
    backgroundColor: '#626570',
    borderRadius: 20,
    marginTop: 20,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  scrollList: {
    height: 110,
    width: '95%',
    justifyContent: 'space-evenly',
    paddingVertical: 30,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#d3d3d3',
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '30%'
  },
  selectedCategoryButton: {
    backgroundColor: '#1e90ff', // Highlight color for selected
  },
  categoryText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  inventoryTable: {
    flex: 1,
    marginTop: 20,
    width: '100%',
    padding: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#d3d3d3',
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    width: '100%',
    backgroundColor: '#d3d3d3',
  },
  columnHeader: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cellText: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
  },
  editableCell: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#fff',
    height: 25,
  },
  bottomButtons: {
    flex: 1,
    alignItems: 'flex-start',
    maxHeight: 15,
  },
  trashIcon: {
    fontSize: 24,
    color: "red",
    marginLeft: 10,
  },
});
