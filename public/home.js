$.when(
    $.get("https://disease.sh/v2/all"),
    $.get("https://disease.sh/v2/countries?sort=cases"),
    $.get("https://disease.sh/v2/historical/all?lastdays=30")

).then(function(all, countrywise, historicaldata) {
    let data = countrywise[0];
    for(let i=0; i<data.length; i++) {
        if(data[i].country !== "World") {
            let result = `<tr class="font-weight-bold" onclick="window.location='/details?countryid=${data[i].countryInfo._id}'"><td><img class="flags" src="${data[i].countryInfo.flag}"/> ${data[i].country}</td><td>${data[i].cases.toLocaleString("hi-IN")}</td> ${(data[i].todayCases>0) ? (`<td>+${data[i].todayCases.toLocaleString("hi-IN")}</td>`) : (`<td>${data[i].todayCases.toLocaleString("hi-IN")}</td>`)}<td>${data[i].deaths.toLocaleString("hi-IN")}</td>${(data[i].todayDeaths>0) ? (`<td class="text-danger">+${data[i].todayDeaths.toLocaleString("hi-IN")}</td>`) : (`<td>${data[i].todayDeaths}</td>`)} ${(data[i].recovered>0) ? (`<td class="text-success">${data[i].recovered.toLocaleString("hi-IN")}</td>`) : (`<td>${data[i].recovered.toLocaleString("hi-IN")}</td>`)}<td>${data[i].active.toLocaleString("hi-IN")}</td> ${(data[i].tests > 0) ? (`<td>${data[i].tests.toLocaleString("hi-IN")}</td>`) : (`<td></td>`)} ${(data[i].casesPerOneMillion !== null) ? (`<td>${data[i].casesPerOneMillion.toLocaleString("hi-IN")}</td>`) : (`<td></td>`)} ${(data[i].deathsPerOneMillion !== null) ? (`<td>${data[i].deathsPerOneMillion.toLocaleString("hi-IN")}</td>`) : (`<td></td>`)} ${(data[i].testsPerOneMillion > 0) ? (`<td>${data[i].testsPerOneMillion.toLocaleString("hi-IN")}</td>`) : (`<td></td>`)} </tr>`;
            $('tbody').append(result);
        }
    }

    $('.tcases').text(`Cases: ${all[0].cases.toLocaleString("hi-IN")}`);
    $('.tdeaths').text(`Deaths: ${all[0].deaths.toLocaleString("hi-IN")}`);
    $('.recovered').text(`Recovered: ${all[0].recovered.toLocaleString("hi-IN")}`);

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
    console.log(id);
    $.ajax({
        url: '/country/' + id,
        type: 'GET',
        success: function (message) {
            console.log("Received" + message);
        }
    });
}