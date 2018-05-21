var fixtures = {};

$('.fixture').each(parseFixture);

function parseFixture(ind, fixture) {
    var f = $(fixture);
    fixtures[f.data('id')] = {
        datetimeUtc: f.find('[class$=datetime]').data('utcdate'),
        group: f.find('[class$=group]').text().replace('Group ', ''),
        stadium: f.find('[class$=stadium]').text(),
        location: f.find('[class$=venue]').text(),
        homeTeam: f.find('.home [class$=nTri]').text(),
        awayTeam: f.find('.away [class$=nTri]').text(),
    };
}

console.log(JSON.stringify(fixtures));