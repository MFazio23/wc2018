var wcTeams = ["RUS", "KSA", "EGY", "URU", "POR", "ESP", "MAR", "IRN", "FRA", "AUS", "PER", "DEN", "ARG", "ISL", "CRO", "NGA", "BRA", "SUI", "CRC", "SRB", "GER", "MEX", "SWE", "KOR", "BEL", "PAN", "TUN", "ENG", "POL", "SEN", "COL", "JPN"];

var teams = {};
$("table.tbl-ranking tr.anchor").each(function(ind, row) {
    var $row = $(row),
        id = $row.find('.tbl-countrycode').text();

    if(wcTeams.indexOf(id) >= 0) {
        teams[id] = {
            name: $row.find('.tbl-teamname a').text(),
            ranking: $row.find('.tbl-rank').text()
        };
    }
});

JSON.stringify(teams);