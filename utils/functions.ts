export function getRounded1Number(num : number) : number {
    if (isNaN(num)) {
        return 0;
    }
    return parseFloat(num.toFixed(1));
}
export function getPercentage(num : number, substatText : string) : String {
    if (isNaN(num)) {
        return "No data";
    }
    if(substatText === "Elemental Mastery"){
        return num.toString();
    }else{
        return (num * 100).toFixed(1) + "%";
    }
}