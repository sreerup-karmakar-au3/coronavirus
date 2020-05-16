$.when(
    $.get("https://disease.sh/v2/all"),
    $.get("https://disease.sh/v2/countries?sort=cases"),
    $.get("https://disease.sh/v2/historical/all?lastdays=30")

).then(function(all, countrywise, historicaldata) {

    $('.tcases').text(`Cases: ${all[0].cases.toLocaleString("hi-IN")}`);
    $('.tdeaths').text(`Deaths: ${all[0].deaths.toLocaleString("hi-IN")}`);
    $('.recovered').text(`Recovered: ${all[0].recovered.toLocaleString("hi-IN")}`);

    var data = countrywise[0];

    data.map(item => {
        let result = 
        `<tr class="font-weight-bold" onclick="window.location='/details?countryid=${item.countryInfo._id}'">
            <td><img class="flags" src="${item.countryInfo.flag}"/> ${item.country}</td>
            <td>${item.cases.toLocaleString("hi-IN")}</td>
            ${(item.todayCases>0) ? (`<td>+${item.todayCases.toLocaleString("hi-IN")}</td>`) : ('<td></td>')}
            ${(item.deaths !== null) ? (`<td>${item.deaths.toLocaleString("hi-IN")}</td>`) : ('<td></td>')}
            ${(item.todayDeaths>0) ? (`<td class="text-danger">+${item.todayDeaths.toLocaleString("hi-IN")}</td>`) : (`<td>${item.todayDeaths}</td>`)}
            ${(item.recovered>0 && item.recovered !== null) ? (`<td class="text-success">${item.recovered.toLocaleString("hi-IN")}</td>`) : ('<td></td>')}
            <td>${item.active.toLocaleString("hi-IN")}</td>
            ${(item.tests > 0) ? (`<td>${item.tests.toLocaleString("hi-IN")}</td>`) : ('<td></td>')}
            ${(item.casesPerOneMillion !== null) ? (`<td>${item.casesPerOneMillion.toLocaleString("hi-IN")}</td>`) : ('<td></td>')}
            ${(item.deathsPerOneMillion !== null) ? (`<td>${item.deathsPerOneMillion.toLocaleString("hi-IN")}</td>`) : ('<td></td>')}
            ${(item.testsPerOneMillion > 0) ? (`<td>${item.testsPerOneMillion.toLocaleString("hi-IN")}</td>`) : ('<td></td>')}
        </tr>`;
        $('tbody').append(result);
    });

    var date = []
    for(key in historicaldata[0].cases) {
        date.push(new Date(key).toLocaleDateString('en-GB', {day: 'numeric', month: 'short'}).replace(/ /g, '-'));
    }

    Chart.defaults.global.legend.display = false;
    new Chart(document.getElementById('myChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: date,
            datasets: [
                {
                    label: 'Cases',
                    backgroundColor: 'rgba(255, 255, 255, 0)',
                    borderColor: 'rgb(40, 62, 255)',
                    data: Object.values(historicaldata[0].cases)
                },
                {
                    label: 'Deaths',
                    backgroundColor: 'rgba(255, 255, 255, 0)',
                    borderColor: 'rgb(214, 28, 21)',
                    data: Object.values(historicaldata[0].deaths)
                },
                {
                    label: 'Recovered',
                    backgroundColor: 'rgba(255, 255, 255, 0)',
                    borderColor: 'rgb(0, 128, 0)',
                    data: Object.values(historicaldata[0].recovered)
                }
            ]
        },
        options: {
            responsive:true,
            maintainAspectRatio: false,
        }
    });
});

function myFunction(id) {
    $.ajax({
        url: '/country/' + id,
        type: 'GET',
        success: function (message) {
            console.log("Received" + message);
        }
    });
}