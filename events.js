function parseevents(title, feed, link) {

    $.getJSON(feed, printevents);

    var enmonths = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    var frmonths = ["jan", "f&eacute;v", "mar", "avr", "mai", "jun", "jul", "ao&ucirc;", "sep", "oct", "nov", "d&eacute;c"];

    // checks if page is on the FR site
    function isfrench() {
        return $('.fr-CA').length;
    }

    // chooses FR or EN months
    function month(month) {
        if (isfrench()) {
            return frmonths[month];
        }
        return enmonths[month];
    }

    // chooses FR or EN event link
    function whichsite() {
        if (isfrench()) {
            return 'evenements';
        }
        return 'events';
    }

    // cleans date format, changes UTC to local time
    function fixdate(startdate, offset) {
        var dateparts = $.trim(startdate).split("T");
        var splitdate = dateparts[0].split("-");
        var splittime = dateparts[1].split(":");
        var utcdate = new Date(splitdate[0], splitdate[1] - 1, splitdate[2], splittime[0], splittime[1], splittime[2]);
        var localdate = new Date(utcdate.getTime() + (parseInt(offset, 10) * 1000));
        return localdate;
    }

    // trims description to max 60 characters
    function trim(description) {
        return $.trim(description).substring(0, 60).split(" ").slice(0, -1).join(" ") + "...";
    }

    // chooses FR or EN link text
    function seeall() {
        if (isfrench()) {
            return '<p class="eventfooter"><a href="' + link + '">Tout afficher</a></p>';
        }
        return '<p class="eventfooter"><a href="' + link + '">See all events</a></p>';
    }

    function printevents(data) {

        // prints #eventfeed otherwise
        if (data) {

            // inserts feed title
            $("#eventfeed").append('<h2 class="nomargin">' + title + '</h2>\n<ul>\n</ul>');

            // prints each event
            for (var i = 0; i < data.length; i++) {

                // gets the local time in a reasonable date format
                var localdate = fixdate(data[i].starts, data[i].offset);

                // removes dash and date from the end of the titles
                var cleantitle = data[i].title.substring(0, data[i].title.length - 8);

                $("#eventfeed ul").append(
                    '<li>\n' +
                    '<div class="eventdate">\n' +
                    '<p class="eventday">' + localdate.getDate() + '</p>\n' +
                    '<p class="eventmonth">' + month(localdate.getMonth()) + '</p>\n' +
                    '</div>\n' +
                    '<p class="eventtitle"><a href="' + data[i].path + '">' + cleantitle + '</a></p>\n' +
                    '<p class="eventdescription">' + trim(data[i].body) + '</p>\n' +
                    '</li>');
            }
            $("#eventfeed").append(seeall());
        }

        // removes #eventfeed if the feed is empty
        else {
            $("#eventfeed").replaceWith('<!--no events in the feed-->');
        }
    }
}

$(document).ready(function () {
    parseevents(
        'Store events',
        'http://events.mec.ca/webservice/?format=jsonp&callback=?&language=en&items=5',
        'http://events.mec.ca/find-an-event?activity[]=2')
});
