import { useMemo } from "react";
import {
  Calendar,
  CalendarList,
  Agenda,
  LocaleConfig,
  DateData,
} from "react-native-calendars";
import { useThemeColors } from "../constants/ThemeColors";
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
    };


export default function CalendarComponent({onDayPress}: CalendarProps) {
    const ThemeColors = useThemeColors();
    const styles = useMemo(() => getCalendarStyles(ThemeColors), [ThemeColors]);

    return (
        <Calendar
            onDayPress={onDayPress}
            firstDay={1} 
            style={styles.calendar} 
            theme={{
                calendarBackground: ThemeColors.navDefault,
                textSectionTitleColor: ThemeColors.text,
                selectedDayBackgroundColor: ThemeColors.tint,
                selectedDayTextColor: ThemeColors.text,
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
    )
}