export function compareTwoDay(dateStr1: string, dateStr2: string) {
    const convertToStandardFormat = (dateStr: string) => {
        const parts = dateStr.split(' ');
        if (!isNaN(Number(parts[0]))) {
            return dateStr;
        }
        return `${parts[1]} ${parts[0]}`;
    };

    const standardDate1 = convertToStandardFormat(dateStr1);
    const standardDate2 = convertToStandardFormat(dateStr2);
    
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const getParts = (dateStr: string) => { 
        const parts = dateStr.split(' ');
        const day = parseInt(parts[0], 10);
        const month = months.indexOf(parts[1]);
        return { day, month };
    };
    
    const date1Parts = getParts(standardDate1);
    const date2Parts = getParts(standardDate2);
    
    if (date1Parts.month !== date2Parts.month) {
        return date1Parts.month - date2Parts.month;
    }
    return date1Parts.day - date2Parts.day;
}
interface BirthdayProps {
    name: string;
    birthday: string;
    url_icon: string;
}
export function getBirthDayListSortedByDay(arrays: CharacterJSON[]) {
    const mappedArray = arrays.map((char) => {
        return {
            name: char.name,
            birthday: char.birthday,
            url_icon: char.url_icon,
        };
    });
    const sortedArray = mappedArray.sort((char1, char2) => {
        return compareTwoDay(char1.birthday, char2.birthday);
    });
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var groupedArray : {month : string , data : BirthdayProps[]}[] = [];

    months.forEach(month => {
        const monthArray = sortedArray.filter(item => item.birthday.includes(month));
        groupedArray.push({month, data: monthArray})
    });
    return {groupedArray, mappedArray };
}
