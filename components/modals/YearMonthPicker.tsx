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
  onConfirm: (formattedDate: string) => void;
  yearOnly?: boolean; // New prop to toggle year-only mode
}

const YearMonthPickerModal: React.FC<YearMonthPickerModalProps> = ({
  visible,
  onClose,
  onConfirm,
  yearOnly = false,
}) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

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

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    onConfirm(year.toString());
    onClose();
  };

  const handleMonthSelect = (monthIndex: number) => {
    setSelectedMonth(monthIndex + 1);
    const formattedDate = `${String(monthIndex + 1).padStart(2, '0')}-${selectedYear}`;
    onConfirm(formattedDate);
    onClose();
  };

  const years = Array.from({ length: 12 }, (_, index) => selectedYear - 6 + index); // Generate a range of 12 years

  const months = [
    'Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Toukokuu', 'Kesäkuu',
    'Heinäkuu', 'Elokuu', 'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu',
  ];

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
                  styles.grid,
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
                {yearOnly
                  ? years.map((year) => (
                      <TouchableOpacity
                        key={year}
                        style={styles.gridItem}
                        onPress={() => handleYearSelect(year)}
                      >
                        <Text style={styles.gridText}>{year}</Text>
                      </TouchableOpacity>
                    ))
                  : months.map((month, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.gridItem,
                          selectedMonth === index + 1 && styles.selectedItem,
                        ]}
                        onPress={() => handleMonthSelect(index)}
                      >
                        <Text
                          style={[
                            styles.gridText,
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  gridItem: {
    width: '28%',
    padding: 12,
    margin: 5,
    alignItems: 'center',
    borderRadius: 5,
  },
  gridText: {
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
