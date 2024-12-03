import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Easing,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface YearMonthPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (formattedDate: string) => void; // Update type to reflect formatted string
}

const YearMonthPickerModal: React.FC<YearMonthPickerModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const months = [
    'Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Toukokuu', 'Kesäkuu',
    'Heinäkuu', 'Elokuu', 'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu'
  ];

  const animationValue = useRef(new Animated.Value(0)).current;

  const handleYearChange = (direction: 'prev' | 'next') => {
    Animated.timing(animationValue, {
      toValue: direction === 'prev' ? -1 : 1,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setSelectedYear((prev) => (direction === 'prev' ? prev - 1 : prev + 1));
      animationValue.setValue(direction === 'prev' ? 1 : -1);
      Animated.timing(animationValue, {
        toValue: 0,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    });
  };

  const handleMonthSelect = (monthIndex: number) => {
    setSelectedMonth(monthIndex + 1);
    const formattedDate = `${String(monthIndex + 1).padStart(2, '0')}-${selectedYear}`;
    onConfirm(formattedDate);
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <Animated.View style={styles.modalContent}>

              {/* Year Selector */}
              <View style={styles.yearContainer}>
                <TouchableOpacity onPress={() => handleYearChange('prev')}>
                  <MaterialIcons name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.yearText}>{selectedYear}</Text>
                <TouchableOpacity onPress={() => handleYearChange('next')}>
                  <MaterialIcons name="arrow-right" size={24} color="black" />
                </TouchableOpacity>
              </View>

              <Animated.View
                style={[
                  styles.monthGrid,
                  {
                    transform: [
                      {
                        rotateY: animationValue.interpolate({
                          inputRange: [-1, 0, 1],
                          outputRange: ['-90deg', '0deg', '90deg'],
                        }),
                      },
                    ],
                    opacity: animationValue.interpolate({
                      inputRange: [-1, 0, 1],
                      outputRange: [0, 1, 0],
                    }),
                  },
                ]}
              >
                {months.map((month, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.monthItem,
                      selectedMonth === index + 1 && styles.selectedItem,
                    ]}
                    onPress={() => handleMonthSelect(index)}
                  >
                    <Text
                      style={[
                        styles.monthText,
                        selectedMonth === index + 1 && styles.selectedText,
                      ]}
                    >
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  yearContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  yearText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 15,
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  monthItem: {
    width: '28%',
    padding: 12,
    margin: 5,
    alignItems: 'center',
    borderRadius: 5,
  },
  monthText: {
    fontSize: 16,
  },
  selectedItem: {
    backgroundColor: '#3498db',
  },
  selectedText: {
    color: 'white',
  },
});

export default YearMonthPickerModal;
