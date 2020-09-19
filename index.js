const form = document.querySelector('.top-banner form')
const input = document.querySelector('.top-banner input')
const mensaje_error = document.querySelector('.top-banner .mensaje-error')
const lista = document.querySelector('.seccion-tarjetas .ciudades')

const api_key = 'f7fbb0e6fc24240c73feef1a2838536d'

form.addEventListener('submit', (e) => {
    e.preventDefault()
    let inputVal = input.value 

    const listaItems = lista.querySelectorAll('.seccion-tarjetas .ciudad')
    console.log(listaItems)
    const listaItemsArray = Array.from(listaItems)
    console.log(listaItemsArray)

    if (listaItemsArray.length > 0) {
        const filterArray = listaItemsArray.filter(el => {
            let contenido = ''
            if (inputVal.includes(',')) {
                if (inputVal.split(',')[1].length > 3) {
                    inputVal = inputVal.split(',')[0]
                    contenido = el.querySelector('.ciudad-nombre span').textContent.toLowerCase()
                }else{
                    contenido = el.querySelector('.ciudad-nombre').dataset.name .toLowerCase()
                }
            }else{
                contenido = el.querySelector('.ciudad-nombre span') .textContent.toLowerCase()
            }

            return contenido == inputVal.toLowerCase()
        })

        if (filterArray.length > 0) {
            mensaje_error.textContent = `Ya conoces el tiempo para ${filterArray[0].querySelector('.ciudad-nombre span').textContent}... Sea más específico y proporcione el código del país 😉`
            form.reset()
            input.focus()
            return
        }
    }

    const getApi = async () => {
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${api_key}&units=metric&lang=es`

        const response = await fetch(url)
        const data = await response.json(url)
        console.log(data)

        const { main, name, sys, weather, wind } = data

        /*const icon = `https://openweathermap.org/img/wn/${
        weather[0]["icon"]
        }@2x.png`;*/
        const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
        weather[0]["icon"]
        }.svg`;

        const li = document.createElement('li')
        li.classList.add('ciudad')
        const datosClima = `
        <h2 class="ciudad-nombre" data-name="${name}, ${sys.country}">
            <span>${name}</span>
            <sup>${sys.country}</sup>
        </h2>
        <span class="ciudad-temp">${Math.round(main.temp)}<sup>°C</sup></span>
        <div class="tempMaxMin">
            <span>Max ${Math.round(main.temp_max)}<sup>°C</sup></span>
            <span>Min ${Math.round(main.temp_min)}<sup>°C</sup></span>
        <div class='humedad'>
            <span>Humedad: ${main.humidity}%</span>
        </div>
        <div class='viento'>
            <span>Viento: ${wind.speed} m/s</span>
        </div>
        </div>
        <figure>
            <img class="ciudad-icon" src="${icon}" alt="${weather[0]['description']}">
            <figcaption>${weather[0]['description']}</figcaption>
        </figure>
        `
        li.innerHTML = datosClima
        lista.appendChild(li)
    }

    getApi()

    .catch(() => {
        mensaje_error.textContent = 'Busca una ciudad valida 😩'
    }) 

    mensaje_error.textContent = ''
    form.reset()
    input.focus()
})