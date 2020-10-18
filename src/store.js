const today = new Date();
const day = today.getDate();
const month = today.getMonth() + 1;
const year = today.getFullYear();

var yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayDay = yesterday.getDate();
const yesterdayMonth = yesterday.getMonth() + 1;
const yesterdayYear = yesterday.getFullYear();

var dayBeforeYesterday = new Date();
dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
const dayBeforeYesterdayDay = dayBeforeYesterday.getDate();
const dayBeforeYesterdayMonth = dayBeforeYesterday.getMonth() + 1;
const dayBeforeYesterdayYear = dayBeforeYesterday.getFullYear();


const state = {
    apiUrl: "https://api.covid19api.com",
    dates: {
        today:{
            day: day,
            month: month,
            year: year
        },
        yesterday:{
            day: yesterdayDay,
            month: yesterdayMonth,
            year: yesterdayYear
        },
        dayBeforeYesterday:{
            day: dayBeforeYesterdayDay,
            month: dayBeforeYesterdayMonth,
            year: dayBeforeYesterdayYear
        }
    }
}
export default state