require('dotenv').config();
const {
  climaLugar,
  agregarHistorial,
  historialCapitalizado,
} = require('./helpers/models/busquedas');

const {
  leerInput,
  inquirerMenu,
  pausa,
  listarLugares,
} = require('./helpers/inquirer');
const Busquedas = require('./helpers/models/busquedas');

require('colors');

const main = async () => {
  const busquedas = new Busquedas();

  let opt = '';
  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        //Mostrar mensaje
        const termino = await leerInput('Ciudad: ');
        //Buscar los lugares
        lugares = await busquedas.ciudad(termino);
        //Seleccionar el lugar
        const id = await listarLugares(lugares);
        if (id === '0') continue;
        const lugarSeleccionado = lugares.find((l) => l.id === id);

        //Guardar en DB
        busquedas.agregarHistorial(lugarSeleccionado.nombre);
        //Clima
        const clima = await busquedas.climaLugar(lugarSeleccionado);
        //Mostrar resultados
        console.clear();
        console.log('\nInformacion de la ciudad\n'.blue);
        console.log('Ciudad: ', lugarSeleccionado.nombre.green);
        console.log('Latitud: ', lugarSeleccionado.latitud);
        console.log('Longitud: ', lugarSeleccionado.longitud);
        console.log('Como está el clima?: ', clima.description.green);
        console.log('Temperatura: ', clima.temp);
        console.log('Minima: ', clima.min);
        console.log('Maxima: ', clima.max);

        break;

      case 2:
        busquedas.historialCapitalizado.forEach((lugar, i) => {
          const idx = `${i + 1}.`.green;
          console.log(`${idx} ${lugar}`);
        });
        break;
    }

    if (opt !== 0) await pausa();
  } while (opt !== 0);
};

main();
