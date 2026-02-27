/**
 * Ethiopian Calendar Utility
 * Converts Gregorian dates to Ethiopian dates.
 */

export const ETHIOPIAN_MONTHS = [
  { en: "Meskerem", am: "መስከረም" },
  { en: "Tekemt", am: "ጥቅምት" },
  { en: "Hidar", am: "ኅዳር" },
  { en: "Tahsas", am: "ታኅሣሥ" },
  { en: "Tir", am: "ጥር" },
  { en: "Yekatit", am: "የካቲት" },
  { en: "Megabit", am: "መጋቢት" },
  { en: "Miyazya", am: "ሚያዝያ" },
  { en: "Ginbot", am: "ግንቦት" },
  { en: "Sene", am: "ሰኔ" },
  { en: "Hamle", am: "ሐምሌ" },
  { en: "Nehasse", am: "ነሐሴ" },
  { en: "Pagume", am: "ጳጉሜ" },
];

export interface EthiopianDate {
  year: number;
  month: number; // 1-13
  day: number;
  monthNameEn: string;
  monthNameAm: string;
}

/**
 * Converts a Gregorian date to an Ethiopian date.
 * This implementation uses the JDN (Julian Day Number) method for accuracy.
 */
export function toEthiopianDate(date: Date): EthiopianDate {
  const jdn = getJulianDayNumber(date);
  
  // Offset between JDN and Ethiopian Calendar
  const ERA = 1723856;
  const n = jdn - ERA;
  
  const year = Math.floor((4 * n + 3) / 1461);
  const r = n - Math.floor((1461 * year) / 4);
  const month = Math.floor((5 * r + 2) / 153);
  const day = r - Math.floor((153 * month + 2) / 5) + 1;
  
  // The above is a simplified version of the algorithm. 
  // Let's use a more robust one based on the fixed offset.
  // Ethiopian New Year is roughly Sept 11.
  
  // Alternative simpler approach for the specific range we care about:
  const gYear = date.getFullYear();
  const gMonth = date.getMonth() + 1;
  const gDay = date.getDate();
  
  let ethYear = gYear - 8;
  let ethMonth = 0;
  let ethDay = 0;
  
  // Determine if it's a leap year in Gregorian
  const isGregorianLeap = (year: number) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  
  // Ethiopian New Year (Meskerem 1)
  // Usually Sept 11, but Sept 12 if the FOLLOWING Gregorian year is a leap year (because Ethiopian leap year is at the end of its year)
  // Actually, Ethiopian leap year happens when ethYear % 4 === 3.
  // This corresponds to Gregorian leap years where the leap day (Feb 29) falls in that Ethiopian year.
  
  const newYearDay = isGregorianLeap(gYear) ? 12 : 11;
  
  // This is getting complex. Let's use the standard algorithm for JDN to Ethiopian.
  // Ref: https://en.wikipedia.org/wiki/Ethiopian_calendar
  
  const jdnValue = Math.floor(date.getTime() / 86400000) + 2440588;
  
  const r2 = (jdnValue - 1723856) % 1461;
  const n2 = (r2 % 365) + 365 * Math.floor(r2 / 1460);
  
  const ethYearVal = 4 * Math.floor((jdnValue - 1723856) / 1461) + Math.floor(r2 / 365) - Math.floor(r2 / 1460);
  const ethMonthVal = Math.floor(n2 / 30) + 1;
  const ethDayVal = (n2 % 30) + 1;

  // Adjust for the month 13 edge case if n2 is 365 or 366
  let finalMonth = ethMonthVal;
  let finalDay = ethDayVal;
  if (finalMonth > 13) {
      finalMonth = 13;
      finalDay = n2 - 360 + 1;
  }

  return {
    year: ethYearVal,
    month: finalMonth,
    day: finalDay,
    monthNameEn: ETHIOPIAN_MONTHS[finalMonth - 1].en,
    monthNameAm: ETHIOPIAN_MONTHS[finalMonth - 1].am,
  };
}

function getJulianDayNumber(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

export function formatEthiopianDate(ethDate: EthiopianDate): string {
  return `${ethDate.monthNameAm} ${ethDate.day} ${ethDate.year}`;
}

export function formatEthiopianDateEn(ethDate: EthiopianDate): string {
  return `${ethDate.monthNameEn} ${ethDate.day}, ${ethDate.year}`;
}
