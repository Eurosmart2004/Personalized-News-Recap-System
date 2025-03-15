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

    const convertToUTC = (date) => {
        // Parse the date in the UTC+7 timezone (Asia/Ho_Chi_Minh)
        const utc7Date = dayjs().tz('Asia/Ho_Chi_Minh').hour(date.hour).minute(date.minute).second(0).millisecond(0);

        // Convert the UTC+7 time to UTC
        const utcDate = utc7Date.utc();

        return utcDate;
    };

    const [time1, setTime1] = useState(convertToUTC(time[0]));
    const [time2, setTime2] = useState(convertToUTC(time[1]));

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
    }, [time1, time2]);

    const shouldDisableTime1 = (time) => {
        const timeInUTC7 = time.tz('Asia/Ho_Chi_Minh');
        const time2InUTC7 = time2.tz('Asia/Ho_Chi_Minh');
        return timeInUTC7.hour() === time2InUTC7.hour() && timeInUTC7.minute() === time2InUTC7.minute();
    };

    const shouldDisableTime2 = (time) => {
        const timeInUTC7 = time.tz('Asia/Ho_Chi_Minh');
        const time1InUTC7 = time1.tz('Asia/Ho_Chi_Minh');
        return timeInUTC7.hour() === time1InUTC7.hour() && timeInUTC7.minute() === time1InUTC7.minute();
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="container p-md-3">
                <div className='d-flex flex gap-4 flex-wrap'>
                    <TimePicker
                        label="Thời gian nhận email"
                        value={time1}
                        onChange={(newTime1) => setTime1(newTime1)}
                        shouldDisableTime={shouldDisableTime1}
                        views={['hours', 'minutes']}
                        format="HH:mm"
                        ampm={false}
                        timeSteps={{ minutes: 1 }}
                        timezone="default"
                    />
                    <TimePicker
                        label="Thời gian nhận email"
                        value={time2}
                        onChange={(newTime2) => setTime2(newTime2)}
                        shouldDisableTime={shouldDisableTime2}
                        views={['hours', 'minutes']}
                        format="HH:mm"
                        ampm={false}
                        timeSteps={{ minutes: 1 }}
                        timezone="default"
                    />
                </div>
            </div>
        </LocalizationProvider>
    );
}