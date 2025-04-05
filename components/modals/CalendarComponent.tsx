import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CalendarList,
  Agenda,
  LocaleConfig,
  DateData,
} from "react-native-calendars";
import { useThemeColors } from "../../constants/ThemeColors";
import { getCalendarStyles } from "@/styles/components/calendarStyle";

LocaleConfig.locales["fi"] = {
  monthNames: [
    "Tammikuu",
    "Helmikuu",
    "Maaliskuu",
    "Huhtikuu",
    "Toukokuu",
    "Kesäkuu",
    "Heinäkuu",
    "Elokuu",
    "Syyskuu",
    "Lokakuu",
    "Marraskuu",
    "Joulukuu",
  ],
  monthNamesShort: [
    "Tammi",
    "Helmi",
    "Maalis",
    "Huhti",
    "Touko",
    "Kesä",
    "Heinä",
    "Elo",
    "Syys",
    "Loka",
    "Marras",
    "Joulu",
  ],
  dayNames: [
    "Sunnuntai",
    "Maanantai",
    "Tiistai",
    "Keskiviikko",
    "Torstai",
    "Perjantai",
    "Lauantai",
  ],
  dayNamesShort: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"],
};

LocaleConfig.defaultLocale = "fi";

type CalendarProps = {
  onDayPress: (day: DateData) => void;
  dataDates: string[];
  selectedDate: string | null;
};

export default function CalendarComponent({
  onDayPress,
  dataDates,
  selectedDate,
}: CalendarProps) {
  const [initialDate, setInitialDate] = useState<string>("");
  const ThemeColors = useThemeColors();
  const styles = useMemo(() => getCalendarStyles(ThemeColors), [ThemeColors]);

  const transformedDates = useMemo(() => {
    return dataDates.map((date) => {
      const [day, month, year] = date.split(".");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    });
  }, [dataDates]);

  const markedDates = useMemo(() => {
    const marks = transformedDates.reduce((acc, date) => {
      return acc;
    }, {} as Record<string, {  selected?: boolean; selectedColor?: string }>);

    if (selectedDate) {
      marks[selectedDate] = {
        ...marks[selectedDate],
        selected: true,
        selectedColor: ThemeColors.tint,
      };
    }

    return marks;
  }, [transformedDates, selectedDate, ThemeColors]);


  return (
    <Calendar
      onDayPress={onDayPress}
      firstDay={1}
      style={styles.calendar}
      hideExtraDays={true}
      markedDates={markedDates}
      initialDate={selectedDate ? selectedDate : initialDate}
      theme={{
        calendarBackground: ThemeColors.navDefault,
        textSectionTitleColor: ThemeColors.text,
        todayTextColor: ThemeColors.tint,
        dayTextColor: ThemeColors.text,
        textDisabledColor: ThemeColors.text,
        dotColor: ThemeColors.text,
        selectedDotColor: ThemeColors.text,
        arrowColor: ThemeColors.text,
        monthTextColor: ThemeColors.text,
        textDayFontSize: 20,
        textMonthFontSize: 25,
        textDayHeaderFontSize: 22,
      }}
    />
  );
}
