import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isoWeek);
dayjs.extend(isBetween);

(function () {
    console.log(dayjs().isoWeek());
    console.log(dayjs().isoWeekday());
    console.log(dayjs().isoWeekYear());

    console.log(dayjs.unix(12).get('year'));

    const currentDate = dayjs.unix(1625901641);
    const dayFormat = new Array<string>();
    for (let i = 0; i <= 7; i++) {
        const day = currentDate.add(i, 'day');
        console.log(day.isoWeekday());
        dayFormat[day.isoWeekday() - 1] = day.format('D, MMM');
        console.log(day.format('D, MMM'));
    }

    console.log(dayFormat);

})();
