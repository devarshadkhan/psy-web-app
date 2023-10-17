import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import customCalenderStyling from "../../styles/CustomCalender.module.css";

const CalendarComponent = ({ value, onChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        // value={value}
        onChange={onChange}
        dayOfWeekFormatter={(nameOfDay) => nameOfDay}
        showDaysOutsideCurrentMonth
        fixedWeekNumber={5}
        classes={{
          root: customCalenderStyling.customCalenderClass,
        }}
        sx={{
          "& .MuiPickersCalendarHeader-label": {
            fontWeight: "600 !important",
            fontSize: "18px !important",
          },
          "& .MuiButtonBase-root": {
            fontWeight: "500 !important",
            fontFamily: "Space Grotesk",
          },
          "& .Mui-selected": {
            color: "black !important",
            backgroundColor: "#bbf246 !important",
          },
        }}
        views={["day"]}
      />
    </LocalizationProvider>
  );
};

export default CalendarComponent;
