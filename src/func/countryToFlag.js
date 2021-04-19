const ct = require('countries-and-timezones');
export function getCountryFlag(cc) {

    if (cc.length !== 2)
      return cc;
  
    function risl(chr) {
      return String.fromCodePoint(0x1F1E6 - 65 + chr.toUpperCase().charCodeAt(0));
    }
  
    return risl(cc[0]) + risl(cc[1]);
}
export function timezoneToTimeOffset(timezone) {
    let time = ct.getTimezone(timezone);
    return time.utcOffset
}
export function countryToTimezone(country) {
    let timezone = ct.getCountry(country);
    return timezone.timezones[0]
}
