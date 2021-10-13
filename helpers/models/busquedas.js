const fs = require('fs');

const axios = require('axios');

class Busquedas {
  historial = [];
  dbPath = './db/database.json';

  constructor() {
    this.cargarBD();
  }

  get historialCapitalizado() {
    return this.historial.map((lugar) => {
      let palabras = lugar.split('');
      palabras = palabras.map((p) => {
        return p.replace(/\w\S*/g, (w) =>
          w.replace(/^\w/, (c) => c.toUpperCase())
        );
      });
      return palabras.join('');
    });
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      languaje: 'es',
    };
  }

  get paramsOpenweather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      units: 'metric',
      lang: 'es',
    };
  }

  async ciudad(lugar) {
    try {
      const intance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsMapbox,
      });

      const resp = await intance.get();
      return resp.data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.place_name,
        latitud: lugar.center[1],
        longitud: lugar.center[0],
      }));

      return [];
    } catch (error) {
      return [];
    }

    return []; //Retornar lugares
  }

  async climaLugar(lugarSeleccionado) {
    const { latitud, longitud } = lugarSeleccionado;
    try {
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: {
          ...this.paramsOpenweather,
          lat: latitud,
          lon: longitud,
        },
      });

      const resp = await instance.get();
      const { main, weather } = resp.data;

      return {
        description: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp,
      };
    } catch (error) {
      console.log(error.message);
    }
  }

  agregarHistorial(lugar = '') {
    if (this.historial.includes(lugar.toLowerCase())) {
      return;
    }
    this.historial.unshift(lugar.toLowerCase());
    this.guardarDB();
  }

  guardarDB() {
    const payload = {
      historial: this.historial,
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }
  cargarBD() {
    if (!fs.existsSync(this.dbPath)) return;

    const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
    const data = JSON.parse(info);
    console.log(data);

    this.historial = data.historial;
  }
}

module.exports = Busquedas;
