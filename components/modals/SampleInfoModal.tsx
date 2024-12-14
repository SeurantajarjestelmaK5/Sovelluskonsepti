import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native'


interface SampleInfoModalProps {
    visible: boolean;
    onClose: () => void;
  }

const SampleInfoModal:  React.FC<SampleInfoModalProps> = ({
    visible,
    onClose
})=>{
    return (
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={onClose} // Handles back button close on Android
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Image source={require("../../assets/images/Ohjeet.png")} style={styles.image} />
                <Pressable style={styles.closeButton} onPress={onClose}>
                  <Text style={styles.closeButtonText}>Sulje</Text>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };
  
  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '80%',
      backgroundColor: 'white',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      elevation: 5,
    },
    image: {
      width: '100%',
      height: 550,
      resizeMode: 'contain',
    },
    closeButton: {
      backgroundColor: '#FF0000',
      width: '100%',
      padding: 10,
      alignItems: 'center',
    },
    closeButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });
  
  export default SampleInfoModal;