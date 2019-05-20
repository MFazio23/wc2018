const wcTeams = ["ARG", "AUS", "BRA", "CMR", "CAN", "CHI", "CHN", "ENG", "FRA", "GER", "ITA", "JAM", "JPN", "KOR", "NED", "NZL", "NGA", "NOR", "SCO", "RSA", "ESP", "SWE", "THA", "USA"];

let teams = {};
$("#rank-table tr").each(function(ind, row) {
    let $row = $(row),
        id = $row.find('.fi-t__nTri').text();

    if(wcTeams.indexOf(id) >= 0) {
        teams[id] = {
            name: $row.find('.fi-t__nText').text(),
            ranking: $row.find('.fi-table__rank').text()
        };
    }
});

JSON.stringify(teams);