/**
 * The regex expression that matches the formatting flags.
 *
 * @name token
 * @constant
 * @type {RegExp}
 * @default
 */
const token = /(Y|M|D|h|m|s|v)+/g;

/**
 * The regex expression that matches the formatting flags.
 *
 * @name flags
 * @constant
 * @type {Flags}
 * @default
 */
type Flags = {[flag: string]: (duration: Duration, length: number) => string};

const flags: Flags = {
    Y: (duration: Duration, length: number): string => pad(duration.years, length),
    M: (duration: Duration, length: number): string => pad(duration.months, length),
    D: (duration: Duration, length: number): string => pad(duration.days, length),
    h: (duration: Duration, length: number): string => pad(duration.hours, length),
    m: (duration: Duration, length: number): string => pad(duration.minutes, length),
    s: (duration: Duration, length: number): string => pad(duration.seconds, length),
    v: (duration: Duration, length: number): string => pad(duration.milliseconds, length)
}

/**
 * Milliseconds in 1 day.
 *
 * @name millisecondsInDay
 * @constant
 * @type {number}
 * @default
 */
const millisecondsInDay = 86400000

/**
 * Milliseconds in 1 hour
 *
 * @name millisecondsInHour
 * @constant
 * @type {number}
 */
const millisecondsInHour = 3600000

/**
 * Milliseconds in 1 minute
 *
 * @name millisecondsInMinute
 * @constant
 * @type {number}
 * @default
 */
const millisecondsInMinute = 60000

/**
 * 
 * @param {Date} dirtyDate 
 * @param duration 
 * @returns 
 */
function add(dirtyDate: Date, duration): Date {
    const date: Date = new Date(dirtyDate);

    const {
        years = 0,
        months = 0,
        weeks = 0,
        days = 0,
        hours = 0,
        minutes = 0,
        seconds = 0,
    } = duration || {}
    
    // Add years and months
    const dateWithMonths: Date = months || years ? addMonths(date, months + years * 12) : new Date(date.getTime())
    
    // Add weeks and days
    const dateWithDays: Date = days || weeks ? addDays(dateWithMonths, days + weeks * 7) : dateWithMonths
    
    // Add days, hours, minutes and seconds
    const minutesToAdd: number = minutes + hours * 60
    const secondsToAdd: number = seconds + minutesToAdd * 60
    const msToAdd: number = secondsToAdd * 1000
    
    return new Date(dateWithDays.getTime() + msToAdd);
}

function addDays(date: Date, amount: number) {
    // If amount is NaN, then just reutrn the date.
    if(isNaN(amount)) {
        return date
    }

    // If 0 days, no-op to avoid changing times in the hour before end of DST
    if(!amount) {
        return date
    }

    date.setDate(date.getDate() + amount)

    return date
}

function addMonths(date: Date, amount: number) {
    // If amount is NaN, then just reutrn the date.
    if(isNaN(amount)) {
        return date
    }

    // If 0 months, no-op to avoid changing times in the hour before end of DST
    if (!amount) {
      return date
    }

    const dayOfMonth = date.getDate()
  
    // The JS Date object supports date math by accepting out-of-bounds values for
    // month, day, etc. For example, new Date(2020, 0, 0) returns 31 Dec 2019 and
    // new Date(2020, 13, 1) returns 1 Feb 2021.  This is *almost* the behavior we
    // want except that dates will wrap around the end of a month, meaning that
    // new Date(2020, 13, 31) will return 3 Mar 2021 not 28 Feb 2021 as desired. So
    // we'll default to the end of the desired month by adding 1 to the desired
    // month and using a date of 0 to back up one day to the end of the desired
    // month.
    const endOfDesiredMonth = new Date(date.getTime())
    endOfDesiredMonth.setMonth(date.getMonth() + amount + 1, 0)
    const daysInMonth = endOfDesiredMonth.getDate()

    if (dayOfMonth >= daysInMonth) {
      // If we're already at the end of the month, then this is the correct date
      // and we're done.
      return endOfDesiredMonth
    }

    // Otherwise, we now know that setting the original day-of-month value won't
    // cause an overflow, so set the desired day-of-month. Note that we can't
    // just set the date of `endOfDesiredMonth` because that object may have had
    // its time changed in the unusual case where where a DST transition was on
    // the last day of the month and its local time was in the hour skipped or
    // repeated next to a DST transition.  So we use `date` instead which is
    // guaranteed to still have the original time.
    date.setFullYear(
      endOfDesiredMonth.getFullYear(),
      endOfDesiredMonth.getMonth(),
      dayOfMonth
    )
    
    return date
}

function compareAsc(dirtyLeft: Date, dirtyRight: Date): number {
    const left: Date = new Date(dirtyLeft);
    const right: Date = new Date(dirtyRight);
    const diff = left.getTime() - right.getTime()
  
    if (diff < 0) {
        return -1
    } else if (diff > 0) {
        return 1
    } else {
        return diff
    }
}

function endOfDay(date: Date): Date {
    date.setHours(23, 59, 59, 999)
    return date
}

function endOfMonth(date: Date): Date {
    const month = date.getMonth()
    date.setFullYear(date.getFullYear(), month + 1, 0)
    date.setHours(23, 59, 59, 999)
    return date
}

function isLastDayOfMonth(date: Date): boolean {
    return endOfDay(date).getTime() === endOfMonth(date).getTime()
}

function differenceInCalendarYears(dirtyLeft: Date, dirtyRight: Date): number {
    const left: Date = new Date(dirtyLeft);
    const right: Date = new Date(dirtyRight);
    return left.getFullYear() - right.getFullYear()
}

function differenceInCalendarMonths(dirtyLeft: Date, dirtyRight: Date): number {
    const left: Date = new Date(dirtyLeft);
    const right: Date = new Date(dirtyRight);
    const yearDiff = left.getFullYear() - right.getFullYear()
    const monthDiff = left.getMonth() - right.getMonth()
    return yearDiff * 12 + monthDiff
}

function differenceInYears(dirtyLeft: Date, dirtyRight: Date): number {
    const left: Date = new Date(dirtyLeft);
    const right: Date = new Date(dirtyRight);
    const sign = compareAsc(left, right)
    const difference = Math.abs(differenceInCalendarYears(left, right))
  
    // Set both dates to a valid leap year for accurate comparison when dealing
    // with leap days
    left.setFullYear(1584)
    right.setFullYear(1584)
  
    // Math.abs(diff in full years - diff in calendar years) === 1 if last calendar year is not full
    // If so, result must be decreased by 1 in absolute value
    const isLastYearNotFull = compareAsc(left, right) === -sign
    const result = sign * (difference - Number(isLastYearNotFull))

    // Prevent negative zero
    return result === 0 ? 0 : result
}

function differenceInMonths(dirtyLeft: Date, dirtyRight: Date): number {
    const left: Date = new Date(dirtyLeft);
    const right: Date = new Date(dirtyRight);
    const sign = compareAsc(left, right)
    const difference = Math.abs(differenceInCalendarMonths(left, right))

    // Check for the difference of less than month
    if(difference < 1) {
        return 0;
    }

    if(left.getMonth() === 1 && left.getDate() > 27) {
        // This will check if the date is end of Feb and assign a higher end of month date
        // to compare it with Jan
        left.setDate(30)
    }

    left.setMonth(left.getMonth() - sign * difference)

    // Math.abs(diff in full months - diff in calendar months) === 1 if last calendar month is not full
    // If so, result must be decreased by 1 in absolute value
    let isLastMonthNotFull = compareAsc(left, right) === -sign

    // Check for cases of one full calendar month
    if(isLastDayOfMonth(left) && difference === 1 && compareAsc(left, right) === 1) {
        isLastMonthNotFull = false
    }

    const result = sign * (difference - Number(isLastMonthNotFull))
    
    // Prevent negative zero
    return result === 0 ? 0 : result
}

function differenceInDays(left: Date, right: Date): number {
    return Math.floor(differenceInMilliseconds(left, right) / millisecondsInDay);
}

function differenceInHours(left: Date, right: Date): number {
    return Math.floor(differenceInMilliseconds(left, right) / millisecondsInHour);
}

function differenceInMinutes(left: Date, right: Date): number {
    return Math.floor(differenceInMilliseconds(left, right) / millisecondsInMinute);
}

function differenceInSeconds(left: Date, right: Date): number {
    return Math.floor(differenceInMilliseconds(left, right) / 1000);
}

function differenceInMilliseconds(dirtyLeft: Date, dirtyRight: Date): number {
    return new Date(dirtyLeft).getTime() - new Date(dirtyRight).getTime();
}

function sort(...dates) {
    return dates.sort((a, b) => a < b ? -1 : 1)
}

function pad(val: string | number, len = 2): string {
    val = String(val);

    while (val.length < len) {
        val = "0" + val;
    }

    return val;
};

export default class Duration {
    readonly years: number = 0
    readonly months: number = 0
    readonly days: number = 0
    readonly hours: number = 0
    readonly minutes: number = 0
    readonly seconds: number = 0
    readonly milliseconds: number = 0

    constructor(dirtStart: Date, dirtyEnd: Date) {
        const [ start, end ]: Date[] = sort(
            new Date(dirtStart), new Date(dirtyEnd)
        );
        
        this.years = differenceInYears(new Date(end), new Date(start));

        const remainingMonths: Date = add(start, { years: this.years });    
        this.months = differenceInMonths(end, remainingMonths);

        const remainingDays: Date = add(remainingMonths, { months: this.months });        
        this.days = differenceInDays(end, remainingDays);

        const remainingHours: Date = add(remainingDays, { days: this.days }); 
        this.hours = differenceInHours(new Date(end), remainingHours);

        const remainingMinutes: Date = add(remainingHours, { hours: this.hours });        
        this.minutes = differenceInMinutes(end, remainingMinutes);

        const remainingSeconds: Date = add(remainingMinutes, { minutes: this.minutes });        
        this.seconds = differenceInSeconds(end, remainingSeconds);

        const remainingMilliseconds: Date = add(remainingSeconds, { seconds: this.seconds });        
        this.milliseconds = differenceInMilliseconds(end, remainingMilliseconds);
        
    }

    /**
     * Format the duration into a formatted string.
     * 
     * @returns {Date}
     */
    public format(pattern: string): string {
        pattern = pattern.replace(token, i => {
            const key = i.slice(0, 1);

            if(!flags[key]) {
                throw new Error(`Invalid date format: ${i}`);
            }
    
            return flags[key](this, i.length)
        });

        return pattern;
    }
}