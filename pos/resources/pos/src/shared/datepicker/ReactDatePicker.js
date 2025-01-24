import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { registerLocale } from "react-datepicker";
import { enGB, es, de, tr, fr, ar, vi, zhCN } from "date-fns/locale";
import { useSelector } from "react-redux";
import { Tokens } from "../../constants";

const ReactDatePicker = (props) => {
    const { onChangeDate, newStartDate } = props;
    const [startDate, setStartDate] = useState(new Date());
    const [language, setLanguage] = useState(enGB);
    const [languageCode, setLanguageCode] = useState("enGB");
    const { allConfigData } = useSelector((state) => state);

    const updatedLanguage = localStorage.getItem(Tokens.UPDATED_LANGUAGE);
    const { selectedLanguage } = useSelector((state) => state);
    const messages = updatedLanguage ? updatedLanguage : selectedLanguage;

    useEffect(() => {
        if (messages === "en") {
            setLanguage(enGB);
            setLanguageCode("enGB");
        } else if (messages === "sp") {
            setLanguage(es);
            setLanguageCode("es");
        } else if (messages === "gr") {
            setLanguage(de);
            setLanguageCode("de");
        } else if (messages === "fr") {
            setLanguage(fr);
            setLanguageCode("fr");
        } else if (messages === "ar") {
            setLanguage(ar);
            setLanguageCode("ar");
        } else if (messages === "tr") {
            setLanguage(tr);
            setLanguageCode("tr");
        } else if (messages === "vi") {
            setLanguage(vi);
            setLanguageCode("vi");
        } else if (messages === "cn") {
            setLanguage(zhCN);
            setLanguageCode("cn");
        }
    }, [messages]);

    registerLocale(language, languageCode);

    const handleCallback = (date) => {
        setStartDate(date);
        onChangeDate(date);
    };

    useEffect(() => {
        setStartDate(startDate);
    }, [startDate]);

    const onDatepickerRef = (el) => {
        if (el && el.input) {
            el.input.readOnly = true;
        }
    };

    const format = (allConfigData) => {
        const format = allConfigData && allConfigData.date_format;
        if (format === "d-m-y") {
            return "dd-MM-yyyy";
        } else if (format === "m-d-y") {
            return "MM-dd-yyyy";
        } else if (format === "y-m-d") {
            return "yyyy-MM-dd";
        } else if (format === "m/d/y") {
            return "MM/dd/yyyy";
        } else if (format === "d/m/y") {
            return "dd/MM/yyyy";
        } else if (format === "y/m/d") {
            return "yyyy/MM/dd";
        } else if (format === "m.d.y") {
            return "MM.dd.yyyy";
        } else if (format === "d.m.y") {
            return "dd.MM.yyyy";
        } else if (format === "y.m.d") {
            return "yyyy.MM.dd";
        } else "yyyy-mm-dd";
    };

    return (
        <div className="position-relative datepicker p-0">
            <DatePicker
                wrapperClassName="w-100"
                locale={language}
                className="datepicker__custom-datepicker px-4"
                name="date"
                selected={
                    newStartDate === null
                        ? new Date()
                        : newStartDate
                        ? newStartDate
                        : startDate
                }
                dateFormat={format(allConfigData)}
                onChange={(date) => handleCallback(date)}
                maxDate={new Date()}
                ref={(el) => onDatepickerRef(el)}
            />
            <FontAwesomeIcon icon={faCalendarAlt} className="input-icon" />
        </div>
    );
};

export default ReactDatePicker;
