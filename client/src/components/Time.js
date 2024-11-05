import { useState, useEffect } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function Time(props) {
    const { setTime, time } = props;
    const [time1, setTime1] = useState(dayjs().set('hour', time[0]['hour']).set('minute', time[0]['minute']));
    const [time2, setTime2] = useState(dayjs().set('hour', time[1]['hour']).set('minute', time[1]['minute']));

    useEffect(() => {
        setTime1(convertHourMinuteToCurrentUTC(time[0]));
        setTime2(convertHourMinuteToCurrentUTC(time[1]));
    }, [time]);

    const convertHourMinuteToCurrentUTC = (date) => {
        const nowUTC = dayjs().utc();

        // Set the hour and minute from the provided object
        const utcDate = nowUTC.hour(date.hour).minute(date.minute).second(0).millisecond(0);

        return utcDate;
    };

    const extractHourMinuteUTC7 = (date) => {
        const utc7Date = date.tz('Asia/Ho_Chi_Minh');
        return {
            hour: utc7Date.hour(),
            minute: utc7Date.minute(),
        };
    };


    const sendDataToBackend = () => {
        const time_sent_1 = extractHourMinuteUTC7(time1);
        const time_sent_2 = extractHourMinuteUTC7(time2);
        const data = [time_sent_1, time_sent_2];
        return data;
    };

    useEffect(() => {
        setTime(sendDataToBackend);
    }, [setTime1, setTime2]);

    const shouldDisableTime1 = (time) => {
        return time.hour() === time2.hour() && time.minute() === time2.minute();
    };

    const shouldDisableTime2 = (time) => {
        return time.hour() === time1.hour() && time.minute() === time1.minute();
    };
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="container p-md-3">
                <div className='d-flex flex gap-4 flex-wrap'>
                    <TimePicker
                        label="Time sent news letter"
                        value={time1}
                        onChange={(newTime1) => setTime1(newTime1)}
                        shouldDisableTime={shouldDisableTime1}
                        views={['hours', 'minutes']}
                        format="HH:mm"
                        ampm={false}
                    />
                    <TimePicker
                        label="Time sent news letter"
                        value={time2}
                        onChange={(newTime2) => setTime2(newTime2)}
                        shouldDisableTime={shouldDisableTime2}
                        views={['hours', 'minutes']}
                        format="HH:mm"
                        ampm={false}
                    />
                </div>
            </div>
        </LocalizationProvider>
    );
}
