function time () {
    // Return current UNIX timestamp  
    // *     example 1: timeStamp = time();    // *     results 1: timeStamp > 1000000000 && timeStamp < 2000000000
    return Math.floor(new Date().getTime() / 1000);
}


function mail (to, subject, message, additional_headers, additional_parameters) {
    // Send an email message  
    // 
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/mail
    // +   original by: Brett Zamir (http://brett-zamir.me)
    // %          note 1: Currently only works if the SSJS SendMail method is available
    // %          note 1: and also depends on the ini having been set for 'sendmail_from'
    // %          note 2: 'additional_parameters' argument is not supported
    // *     example 1: mail('you@example.com', 'Hi!', "What's been going on lately?");
    // *     returns 1: true
    // *     example 2: mail("jack@example.com, barry@example.net", 'ok subj', 'my message',
    // *     example 2:           'From: jack@example.com\r\n'+'Organization : Example Corp\r\n'+
    // *     example 2:           'Content-type: text/html;charset=utf8');
    // *     returns 2: true
    var _append = function (sm, prop, value) {
        if (!sm[prop]) { // Ok?
            sm[prop] = '';
            sm[prop] += value;
        } else {
            sm[prop] += ',' + value;
        }
    };

    if (this.window.SendMail) { // See http://research.nihonsoft.org/javascript/ServerReferenceJS12/sendmail.htm
        var sm = new this.window.SendMail();
        var from = this.php_js && this.php_js.ini && this.php_js.ini.sendmail_from && this.php_js.ini.sendmail_from.local_value;
        sm.To = to;
        sm.Subject = subject;
        sm.Body = message;
        sm.From = from;
        if (additional_headers) {
            var headers = additional_headers.trim().split(/\r?\n/);
            for (var i = 0; i < headers.length; i++) {
                var header = headers[i];
                var colonPos = header.indexOf(':');
                if (colonPos === -1) {
                    throw new Error('Malformed headers');
                }
                var prop = header.slice(0, colonPos).trim();
                var value = header.slice(colonPos + 1).trim();
                switch (prop) {
                    // Todo: Add any others to this top fall-through which can allow multiple headers
                    //                via commas; will otherwise be overwritten (Errorsto, Replyto?)
                case 'Bcc':
                    // Fall-through
                case 'Cc':
                    // Fall-through
                case 'To':
                    // Apparently appendable with additional headers per PHP examples
                    _append(sm, prop, value);
                    break;
                case 'Subject':
                    // Overridable in additional headers?
                    break;
                case 'Body':
                    // Overridable in additional headers?
                    break;
                case 'From':
                    // Default, though can be overridden
                    /* Fall-through */
                default:
                    //  Errorsto, Organization, Replyto, Smtpserver
                    sm[prop] = value;
                    break;
                }
            }
        }
        if (!sm.From) {
            throw new Error('Warning: mail(): "sendmail_from" not set in php.ini');
        }
        return sm.send();
    }
    return false;
}


function date (format, timestamp) {
    // Format a local date/time  
    // 
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/date
    // +   original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
    // +      parts by: Peter-Paul Koch (http://www.quirksmode.org/js/beat.html)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: MeEtc (http://yass.meetcweb.com)
    // +   improved by: Brad Touesnard
    // +   improved by: Tim Wiel
    // +   improved by: Bryan Elliott
    //
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: David Randall
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: Theriault
    // +  derived from: gettimeofday
    // +      input by: majak
    // +   bugfixed by: majak
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Alex
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: Theriault
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: Theriault
    // +   improved by: Thomas Beaucourt (http://www.webapp.fr)
    // +   improved by: JT
    // +   improved by: Theriault
    // +   improved by: Rafał Kukawski (http://blog.kukawski.pl)
    // +   bugfixed by: omid (http://phpjs.org/functions/380:380#comment_137122)
    // +      input by: Martin
    // +      input by: Alex Wilson
    // %        note 1: Uses global: php_js to store the default timezone
    // %        note 2: Although the function potentially allows timezone info (see notes), it currently does not set
    // %        note 2: per a timezone specified by date_default_timezone_set(). Implementers might use
    // %        note 2: this.php_js.currentTimezoneOffset and this.php_js.currentTimezoneDST set by that function
    // %        note 2: in order to adjust the dates in this function (or our other date functions!) accordingly
    // *     example 1: date('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400);
    // *     returns 1: '09:09:40 m is month'
    // *     example 2: date('F j, Y, g:i a', 1062462400);
    // *     returns 2: 'September 2, 2003, 2:26 am'
    // *     example 3: date('Y W o', 1062462400);
    // *     returns 3: '2003 36 2003'
    // *     example 4: x = date('Y m d', (new Date()).getTime()/1000); 
    // *     example 4: (x+'').length == 10 // 2009 01 09
    // *     returns 4: true
    // *     example 5: date('W', 1104534000);
    // *     returns 5: '53'
    // *     example 6: date('B t', 1104534000);
    // *     returns 6: '999 31'
    // *     example 7: date('W U', 1293750000.82); // 2010-12-31
    // *     returns 7: '52 1293750000'
    // *     example 8: date('W', 1293836400); // 2011-01-01
    // *     returns 8: '52'
    // *     example 9: date('W Y-m-d', 1293974054); // 2011-01-02
    // *     returns 9: '52 2011-01-02'
    var that = this,
        jsdate, f, formatChr = /\\?([a-z])/gi,
        formatChrCb,
        // Keep this here (works, but for code commented-out
        // below for file size reasons)
        //, tal= [],
        _pad = function (n, c) {
            if ((n = n + '').length < c) {
                return new Array((++c) - n.length).join('0') + n;
            }
            return n;
        },
        txt_words = ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    formatChrCb = function (t, s) {
        return f[t] ? f[t]() : s;
    };
    f = {
        // Day
        d: function () { // Day of month w/leading 0; 01..31
            return _pad(f.j(), 2);
        },
        D: function () { // Shorthand day name; Mon...Sun
            return f.l().slice(0, 3);
        },
        j: function () { // Day of month; 1..31
            return jsdate.getDate();
        },
        l: function () { // Full day name; Monday...Sunday
            return txt_words[f.w()] + 'day';
        },
        N: function () { // ISO-8601 day of week; 1[Mon]..7[Sun]
            return f.w() || 7;
        },
        S: function () { // Ordinal suffix for day of month; st, nd, rd, th
            var j = f.j();
            return j > 4 && j < 21 ? 'th' : {1: 'st', 2: 'nd', 3: 'rd'}[j % 10] || 'th';
        },
        w: function () { // Day of week; 0[Sun]..6[Sat]
            return jsdate.getDay();
        },
        z: function () { // Day of year; 0..365
            var a = new Date(f.Y(), f.n() - 1, f.j()),
                b = new Date(f.Y(), 0, 1);
            return Math.round((a - b) / 864e5) + 1;
        },

        // Week
        W: function () { // ISO-8601 week number
            var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3),
                b = new Date(a.getFullYear(), 0, 4);
            return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
        },

        // Month
        F: function () { // Full month name; January...December
            return txt_words[6 + f.n()];
        },
        m: function () { // Month w/leading 0; 01...12
            return _pad(f.n(), 2);
        },
        M: function () { // Shorthand month name; Jan...Dec
            return f.F().slice(0, 3);
        },
        n: function () { // Month; 1...12
            return jsdate.getMonth() + 1;
        },
        t: function () { // Days in month; 28...31
            return (new Date(f.Y(), f.n(), 0)).getDate();
        },

        // Year
        L: function () { // Is leap year?; 0 or 1
            return new Date(f.Y(), 1, 29).getMonth() === 1 | 0;
        },
        o: function () { // ISO-8601 year
            var n = f.n(),
                W = f.W(),
                Y = f.Y();
            return Y + (n === 12 && W < 9 ? -1 : n === 1 && W > 9);
        },
        Y: function () { // Full year; e.g. 1980...2010
            return jsdate.getFullYear();
        },
        y: function () { // Last two digits of year; 00...99
            return (f.Y() + "").slice(-2);
        },

        // Time
        a: function () { // am or pm
            return jsdate.getHours() > 11 ? "pm" : "am";
        },
        A: function () { // AM or PM
            return f.a().toUpperCase();
        },
        B: function () { // Swatch Internet time; 000..999
            var H = jsdate.getUTCHours() * 36e2,
                // Hours
                i = jsdate.getUTCMinutes() * 60,
                // Minutes
                s = jsdate.getUTCSeconds(); // Seconds
            return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
        },
        g: function () { // 12-Hours; 1..12
            return f.G() % 12 || 12;
        },
        G: function () { // 24-Hours; 0..23
            return jsdate.getHours();
        },
        h: function () { // 12-Hours w/leading 0; 01..12
            return _pad(f.g(), 2);
        },
        H: function () { // 24-Hours w/leading 0; 00..23
            return _pad(f.G(), 2);
        },
        i: function () { // Minutes w/leading 0; 00..59
            return _pad(jsdate.getMinutes(), 2);
        },
        s: function () { // Seconds w/leading 0; 00..59
            return _pad(jsdate.getSeconds(), 2);
        },
        u: function () { // Microseconds; 000000-999000
            return _pad(jsdate.getMilliseconds() * 1000, 6);
        },

        // Timezone
        e: function () { // Timezone identifier; e.g. Atlantic/Azores, ...
            // The following works, but requires inclusion of the very large
            // timezone_abbreviations_list() function.
/*              return this.date_default_timezone_get();
*/
            throw 'Not supported (see source code of date() for timezone on how to add support)';
        },
        I: function () { // DST observed?; 0 or 1
            // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
            // If they are not equal, then DST is observed.
            var a = new Date(f.Y(), 0),
                // Jan 1
                c = Date.UTC(f.Y(), 0),
                // Jan 1 UTC
                b = new Date(f.Y(), 6),
                // Jul 1
                d = Date.UTC(f.Y(), 6); // Jul 1 UTC
            return 0 + ((a - c) !== (b - d));
        },
        O: function () { // Difference to GMT in hour format; e.g. +0200
            var tzo = jsdate.getTimezoneOffset(),
                a = Math.abs(tzo);
            return (tzo > 0 ? "-" : "+") + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
        },
        P: function () { // Difference to GMT w/colon; e.g. +02:00
            var O = f.O();
            return (O.substr(0, 3) + ":" + O.substr(3, 2));
        },
        T: function () { // Timezone abbreviation; e.g. EST, MDT, ...
            // The following works, but requires inclusion of the very
            // large timezone_abbreviations_list() function.
/*              var abbr = '', i = 0, os = 0, default = 0;
            if (!tal.length) {
                tal = that.timezone_abbreviations_list();
            }
            if (that.php_js && that.php_js.default_timezone) {
                default = that.php_js.default_timezone;
                for (abbr in tal) {
                    for (i=0; i < tal[abbr].length; i++) {
                        if (tal[abbr][i].timezone_id === default) {
                            return abbr.toUpperCase();
                        }
                    }
                }
            }
            for (abbr in tal) {
                for (i = 0; i < tal[abbr].length; i++) {
                    os = -jsdate.getTimezoneOffset() * 60;
                    if (tal[abbr][i].offset === os) {
                        return abbr.toUpperCase();
                    }
                }
            }
*/
            return 'UTC';
        },
        Z: function () { // Timezone offset in seconds (-43200...50400)
            return -jsdate.getTimezoneOffset() * 60;
        },

        // Full Date/Time
        c: function () { // ISO-8601 date.
            return 'Y-m-d\\Th:i:sP'.replace(formatChr, formatChrCb);
        },
        r: function () { // RFC 2822
            return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
        },
        U: function () { // Seconds since UNIX epoch
            return jsdate.getTime() / 1000 | 0;
        }
    };
    this.date = function (format, timestamp) {
        that = this;
        jsdate = ((typeof timestamp === 'undefined') ? new Date() : // Not provided
        (timestamp instanceof Date) ? new Date(timestamp) : // JS Date()
        new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
        );
        return format.replace(formatChr, formatChrCb);
    };
    return this.date(format, timestamp);
}

function date_default_timezone_get () {
    // !No description available for date_default_timezone_get. @php.js developers: Please update the function summary text file.
    // 
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/date_default_timezone_get
    // +   original by: Brett Zamir (http://brett-zamir.me)
    // -    depends on: timezone_abbreviations_list
    // %        note 1: Uses global: php_js to store the default timezone
    // *     example 1: date_default_timezone_get();
    // *     returns 1: 'unknown'
    var tal = {},
        abbr = '',
        i = 0,
        curr_offset = -(new Date()).getTimezoneOffset() * 60;

    if (this.php_js) {
        if (this.php_js.default_timezone) { // set by date_default_timezone_set
            return this.php_js.default_timezone;
        }
        if (this.php_js.ENV && this.php_js.ENV.TZ) { // getenv
            return this.php_js.ENV.TZ;
        }
        if (this.php_js.ini && this.php_js.ini['date.timezone']) { // e.g., if set by ini_set()
            return this.php_js.ini['date.timezone'].local_value ? this.php_js.ini['date.timezone'].local_value : this.php_js.ini['date.timezone'].global_value;
        }
    }
    // Get from system
    tal = this.timezone_abbreviations_list();
    for (abbr in tal) {
        for (i = 0; i < tal[abbr].length; i++) {
            if (tal[abbr][i].offset === curr_offset) {
                return tal[abbr][i].timezone_id;
            }
        }
    }
    return 'UTC';
}

function date_default_timezone_set (tz) {
    // Sets the default timezone used by all date/time functions in a script  
    // 
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/date_default_timezone_set
    // +   original by: Brett Zamir (http://brett-zamir.me)
    // -    depends on: timezone_abbreviations_list
    // %        note 1: Uses global: php_js to store the default timezone
    // *     example 1: date_default_timezone_set('unknown');
    // *     returns 1: 'unknown'
    var tal = {},
        abbr = '',
        i = 0;

    // BEGIN REDUNDANT
    this.php_js = this.php_js || {};
    // END REDUNDANT
    // PHP verifies that the timezone is valid and also sets this.php_js.currentTimezoneOffset and this.php_js.currentTimezoneDST if so
    tal = this.timezone_abbreviations_list();
    for (abbr in tal) {
        for (i = 0; i < tal[abbr].length; i++) {
            if (tal[abbr][i].timezone_id === tz) {
                this.php_js.default_timezone = tz;
                return true;
            }
        }
    }
    return false;
}

function date_parse (date) {
    // Returns associative array with detailed info about given date  
    // 
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/date_parse
    // +   original by: Brett Zamir (http://brett-zamir.me)
    // -    depends on: strtotime
    // *     example 1: date_parse('2006-12-12 10:00:00.5');
    // *     returns 1: {year : 2006, month: 12, day: 12, hour: 10, minute: 0, second: 0, fraction: 0.5, warning_count: 0, warnings: [], error_count: 0, errors: [], is_localtime: false}
    // BEGIN REDUNDANT
    this.php_js = this.php_js || {};
    // END REDUNDANT

    var warningsOffset = this.php_js.warnings ? this.php_js.warnings.length : null;
    var errorsOffset = this.php_js.errors ? this.php_js.errors.length : null;

    try {
        var ts = this.strtotime(date);
    } finally {
        if (!ts) {
            return false;
        }
    }

    var dt = new Date(ts * 1000);

    var retObj = { // Grab any new warnings or errors added (not implemented yet in strtotime()); throwing warnings, notices, or errors could also be easily monitored by using 'watch' on this.php_js.latestWarning, etc. and/or calling any defined error handlers
        warning_count: warningsOffset !== null ? this.php_js.warnings.slice(warningsOffset).length : 0,
        warnings: warningsOffset !== null ? this.php_js.warnings.slice(warningsOffset) : [],
        error_count: errorsOffset !== null ? this.php_js.errors.slice(errorsOffset).length : 0,
        errors: errorsOffset !== null ? this.php_js.errors.slice(errorsOffset) : []
    };
    retObj.year = dt.getFullYear();
    retObj.month = dt.getMonth() + 1;
    retObj.day = dt.getDate();
    retObj.hour = dt.getHours();
    retObj.minute = dt.getMinutes();
    retObj.second = dt.getSeconds();
    retObj.fraction = parseFloat('0.' + dt.getMilliseconds());
    retObj.is_localtime = dt.getTimezoneOffset !== 0;

    return retObj;
}

function deaggregate (obj, class_name) {
    // !No description available for deaggregate. @php.js developers: Please update the function summary text file.
    // 
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/deaggregate
    // +   original by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: var A = function () {};
    // *     example 1: A.prop = 5;
    // *     example 1: A.prototype.someMethod = function () {};
    // *     example 1: var b = {};
    // *     example 1: aggregate(b, 'A');
    // *     example 1: deaggregate(b, 'A');
    // *     returns 1: undefined
    var p = '',
        idx = -1,
        pos = -1,
        i = 0,
        indexOf = function (value) {
            for (var i = 0, length = this.length; i < length; i++) {
                if (this[i] === value) {
                    return i;
                }
            }
            return -1;
        },
        getFuncName = function (fn) {
            var name = (/\W*function\s+([\w\$]+)\s*\(/).exec(fn);
            if (!name) {
                return '(Anonymous)';
            }
            return name[1];
        };

    if (!this.php_js || !this.php_js.aggregateRecords || !this.php_js.aggregateKeys || !this.php_js.aggregateClasses) {
        return;
    }

    if (!this.php_js.aggregateKeys.indexOf) {
        this.php_js.aggregateKeys.indexOf = indexOf;
    }
    idx = this.php_js.aggregateKeys.indexOf(obj);
    if (idx === -1) {
        return;
    }

    if (class_name) {
        if (typeof class_name === 'string') { // PHP behavior
            class_name = this.window[class_name];
        }
        if (!this.php_js.aggregateClasses[idx].indexOf) {
            this.php_js.aggregateClasses[idx].indexOf = indexOf;
        }
        pos = this.php_js.aggregateClasses[idx].indexOf(getFuncName(class_name));
        if (pos !== -1) {
            for (p in this.php_js.aggregateRecords[idx][pos]) {
                delete obj[p];
            }
            this.php_js.aggregateClasses[idx].splice(pos, 1);
            this.php_js.aggregateRecords[idx].splice(pos, 1);
        }
    } else {
        for (i = 0; i < this.php_js.aggregateClasses[idx].length; i++) {
            for (p in this.php_js.aggregateRecords[idx][i]) {
                delete obj[p];
            }
        }
        this.php_js.aggregateClasses.splice(idx, 1);
        this.php_js.aggregateRecords.splice(idx, 1);
    }
}



function mktime () {
    // Get UNIX timestamp for a date  
    // 
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/mktime
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: baris ozdil
    // +      input by: gabriel paderni
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: FGFEmperor
    // +      input by: Yannoo
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: jakes
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Marc Palau
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +      input by: 3D-GRAF
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Chris
    // +    revised by: Theriault
    // %        note 1: The return values of the following examples are
    // %        note 1: received only if your system's timezone is UTC.
    // *     example 1: mktime(14, 10, 2, 2, 1, 2008);
    // *     returns 1: 1201875002
    // *     example 2: mktime(0, 0, 0, 0, 1, 2008);
    // *     returns 2: 1196467200
    // *     example 3: make = mktime();
    // *     example 3: td = new Date();
    // *     example 3: real = Math.floor(td.getTime() / 1000);
    // *     example 3: diff = (real - make);
    // *     results 3: diff < 5
    // *     example 4: mktime(0, 0, 0, 13, 1, 1997)
    // *     returns 4: 883612800 
    // *     example 5: mktime(0, 0, 0, 1, 1, 1998)
    // *     returns 5: 883612800 
    // *     example 6: mktime(0, 0, 0, 1, 1, 98)
    // *     returns 6: 883612800 
    // *     example 7: mktime(23, 59, 59, 13, 0, 2010)
    // *     returns 7: 1293839999
    // *     example 8: mktime(0, 0, -1, 1, 1, 1970)
    // *     returns 8: -1
    var d = new Date(),
        r = arguments,
        i = 0,
        e = ['Hours', 'Minutes', 'Seconds', 'Month', 'Date', 'FullYear'];

    for (i = 0; i < e.length; i++) {
        if (typeof r[i] === 'undefined') {
            r[i] = d['get' + e[i]]();
            r[i] += (i === 3); // +1 to fix JS months.
        } else {
            r[i] = parseInt(r[i], 10);
            if (isNaN(r[i])) {
                return false;
            }
        }
    }

    // Map years 0-69 to 2000-2069 and years 70-100 to 1970-2000.
    r[5] += (r[5] >= 0 ? (r[5] <= 69 ? 2e3 : (r[5] <= 100 ? 1900 : 0)) : 0);

    // Set year, month (-1 to fix JS months), and date.
    // !This must come before the call to setHours!
    d.setFullYear(r[5], r[3] - 1, r[4]);

    // Set hours, minutes, and seconds.
    d.setHours(r[0], r[1], r[2]);

    // Divide milliseconds by 1000 to return seconds and drop decimal.
    // Add 1 second if negative or it'll be off from PHP by 1 second.
    return (d.getTime() / 1e3 >> 0) - (d.getTime() < 0);
}