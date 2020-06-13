$(document).ready(function() {
    let days = parseInt($("input[name='record']:checked").val());
    plotChart(days);

    $("input[type='radio']").on('click', function() {
        days = parseInt($("input[name='record']:checked").val());
        plotChart(days);
    });
});

$.when(
    $.get("https://disease.sh/v2/all"),
    $.get("https://disease.sh/v2/countries?sort=cases")

).then(function(all, countrywise) {

    $('.tcases').text(`Cases: ${all[0].cases.toLocaleString("hi-IN")}`);
    $('.tdeaths').text(`Deaths: ${all[0].deaths.toLocaleString("hi-IN")}`);
    $('.recovered').text(`Recovered: ${all[0].recovered.toLocaleString("hi-IN")}`);

    var data = countrywise[0];

    data.map(item => {
        let result = 
        `<tr class="font-weight-bold" onclick="window.location='/details?countryid=${item.countryInfo._id}'">
            <td><img class="flags" src="${item.countryInfo.flag}"/> ${item.country}</td>
            <td>${item.cases.toLocaleString("hi-IN")} ${(item.todayCases>0 && item.todayCases !== null) ? (`<span class="text-primary">(+${item.todayCases.toLocaleString("hi-IN")})</span>`) : ('')}</td>
            <td>${(item.deaths>0 && item.deaths !== null) ? (`${item.deaths.toLocaleString("hi-IN")}`) : ('')} ${(item.todayDeaths>0 && item.todayDeaths !== null) ? (`<span class="text-danger">(+${item.todayDeaths.toLocaleString("hi-IN")})</span>`) : ('')}</td>
            <td>${(item.recovered>0 && item.recovered !== null) ? (`${item.recovered.toLocaleString("hi-IN")}`) : ('')} ${(item.todayRecovered>0 && item.todayRecovered !== null) ? (`<span class="text-success">(+${item.todayRecovered.toLocaleString("hi-IN")})</span>`) : ('')}</td> 
            <td>${(item.active !== null) ? (`${item.active.toLocaleString("hi-IN")}`) : ('')}</td>
            <td>${(item.tests>0 && item.tests !== null) ? (`${item.tests.toLocaleString("hi-IN")}`) : ('')}</td>
            <td>${(item.casesPerOneMillion !== null) ? (`${item.casesPerOneMillion.toLocaleString("hi-IN")}`) : ('')}</td>
            <td>${(item.deathsPerOneMillion !== null) ? (`${item.deathsPerOneMillion.toLocaleString("hi-IN")}`) : ('')}</td>
            <td>${(item.testsPerOneMillion>0 && item.testsPerOneMillion !== null) ? (`${item.testsPerOneMillion.toLocaleString("hi-IN")}`) : ('')}</td>
            <td>${(item.population !== null) ? (`${item.population.toLocaleString("hi-IN")}`) : ('')}</td>
        </tr>`;
        $('tbody').append(result);
    });
});

function plotChart(days) {
    $.ajax({
        url: `https://disease.sh/v2/historical/all?lastdays=${days}`,
        type: 'GET',
        success: function (historicaldata) {
            var date = []
            for(key in historicaldata.cases) {
                date.push(new Date(key).toLocaleDateString('en-GB', {day: 'numeric', month: 'short'}).replace(/ /g, '-'));
            }

            if(window.RecordChart !== undefined) {
                window.RecordChart.destroy();
            }

            Chart.defaults.global.legend.display = false;
            window.RecordChart = new Chart(document.getElementById('myChart').getContext('2d'), {
                type: 'line',
                data: {
                    labels: date,
                    datasets: [
                        {
                            label: 'Cases',
                            backgroundColor: 'rgba(255, 255, 255, 0)',
                            borderColor: 'rgb(40, 62, 255)',
                            data: Object.values(historicaldata.cases)
                        },
                        {
                            label: 'Deaths',
                            backgroundColor: 'rgba(255, 255, 255, 0)',
                            borderColor: 'rgb(214, 28, 21)',
                            data: Object.values(historicaldata.deaths)
                        },
                        {
                            label: 'Recovered',
                            backgroundColor: 'rgba(255, 255, 255, 0)',
                            borderColor: 'rgb(0, 128, 0)',
                            data: Object.values(historicaldata.recovered)
                        }
                    ]
                },
                options: {
                    responsive:true,
                    maintainAspectRatio: false,
                }
            });
        }
    });
}