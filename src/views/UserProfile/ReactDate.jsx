import "react-dates/initialize"
import "react-dates/lib/css/_datepicker.css"
import "./scss/react_dates_overrides.css"
import React, { useState } from "react"
import { SingleDatePicker } from "react-dates"

export default function ReactDate(props) {
    const [DateFocuse, setDateFocus] = useState(false)

    const setLahirDate = (date) => {
        props.set(date)
        // setDateFocus(false)
    }

    return (
        <SingleDatePicker
            placeholder="Tanggal Lahir"
            date={props.value}
            isOutsideRange={() => false}
            numberOfMonths={1}
            onDateChange={setLahirDate}
            openDirection="up"
            focused={DateFocuse}
            onFocusChange={({ focused }) => setDateFocus(focused)}
            keepOpenOnDateSelect={false}
            disabled={props.disabled}
            block
            id="tanggalLahir"
        />
    )
}
