$.ajax({
    url: `https://disease.sh/v2/historical/${parseInt(window.location.search.split('=')[1])}?lastdays=180`,
    type: 'GET',
    dataType: 'json',
    success: function(countrydetail) {
        if(!jQuery.isEmptyObject(countrydetail.timeline)) {
            $('#cases').text(`Cases`).css("color", "rgb(40, 62, 255)");
            $('#deaths').text(`Deaths`).css("color", "rgb(214, 28, 21)");
            $('#recovery').text(`Recovered`).css("color", "rgb(0, 128, 0)");
        }

        $('.jumbotron > h1').text(`Wuhan Coronavirus effect in ${countrydetail.country}`);

        var date = []
        for(key in countrydetail.timeline.cases) {
            date.push(new Date(key).toLocaleDateString('en-GB', {day: 'numeric', month: 'short'}).replace(/ /g, '-'));
        }

        var chartDate = date.slice(-30);
        var cases = Object.fromEntries(Object.entries(countrydetail.timeline.cases).slice(-30));
        var deaths = Object.fromEntries(Object.entries(countrydetail.timeline.deaths).slice(-30));
        var recovered = Object.fromEntries(Object.entries(countrydetail.timeline.recovered).slice(-30));

        Chart.defaults.global.legend.display = false;

        new Chart(document.getElementById('caseChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: chartDate,
                datasets: [{
                    label: 'Cases',
                    backgroundColor: 'rgba(40, 62, 255, 0.8)',
                    borderColor: 'rgb(40, 62, 255)',
                    data: Object.values(cases)
                }]
            }
        });

        new Chart(document.getElementById('deathChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: chartDate,
                datasets: [{
                    label: 'Deaths',
                    backgroundColor: 'rgba(214, 28, 21, 0.8)',
                    borderColor: 'rgb(214, 28, 21)',
                    data: Object.values(deaths)
                }]
            }
        });

        new Chart(document.getElementById('recoveryChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: chartDate,
                datasets: [{
                    label: 'Recovered',
                    backgroundColor: 'rgba(0, 128, 0, 0.8)',
                    borderColor: 'rgb(0, 128, 0)',
                    data: Object.values(recovered)
                }]
            }
        });

        if(!jQuery.isEmptyObject(countrydetail.timeline)) {
            $('table').css({"border-collapse":"separate", "border": "none"});
            $('#caption').text(`Day-wise count`);
            $('thead').append('<tr><th scope="col">Date</th><th scope="col">Cases</th><th scope="col">Deaths</th><th scope="col">Recovered</th></tr>');
            Object.keys(countrydetail.timeline.cases).forEach(function(key) {
                let result = `<tr><td>${new Date(key).toLocaleDateString('en-GB', {day: 'numeric', month: 'short'}).replace(/ /g, '-')}</td> ${(countrydetail.timeline.cases[key]>0) ? (`<td class="text-primary">${countrydetail.timeline.cases[key].toLocaleString("hi-IN")}</td>`) : (`<td>${countrydetail.timeline.cases[key]}</td>`)} ${(countrydetail.timeline.deaths[key]>0) ? (`<td class="text-danger">${countrydetail.timeline.deaths[key].toLocaleString("hi-IN")}</td>`) : (`<td>${countrydetail.timeline.deaths[key]}</td>`)} ${(countrydetail.timeline.recovered[key]>0) ? (`<td class="text-success">${countrydetail.timeline.recovered[key].toLocaleString("hi-IN")}</td>`) : (`<td>${countrydetail.timeline.recovered[key]}</td>`)} </tr>`
                $('tbody').append(result);
            });
        }
    },
    error: function() {
        $('.jumbotron > h1').text("No record found");
    }
});

$(document).ready(function() {
    if($(window).width() > 576) {
        $('#table-width').addClass('container');
    }
});

$(window).on('resize', function() {
    var win = $(this);
    if (win.width() < 576) {
        $('#table-width').removeClass('container');
    }
    else {
        $('#table-width').addClass('container');
    }
});