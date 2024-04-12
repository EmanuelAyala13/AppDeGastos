const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const archivoGastos = 'gastos.json';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

function mostrarMenu() {
  console.log('\n' + colors.cyan + '*** Aplicación de Gestión de Gastos ***' + colors.reset + '\n');
  console.log(colors.bright + '1. Registrar un gasto');
  console.log('2. Ver todos los gastos');
  console.log('3. Salir' + colors.reset + '\n');
  rl.question(colors.cyan + 'Seleccione una opción: ' + colors.reset, (opcion) => {
    switch (opcion) {
      case '1':
        registrarGasto();
        break;
      case '2':
        verGastos();
        break;
      case '3':
        console.log(colors.bright + 'Gracias por usar la aplicación. ¡Hasta luego!' + colors.reset);
        rl.close();
        break;
      default:
        console.log(colors.red + 'Opción no válida. Por favor, seleccione una opción válida.' + colors.reset);
        mostrarMenu();
        break;
    }
  });
}

function registrarGasto() {
  rl.question(colors.cyan + 'Ingrese la descripción del gasto: ' + colors.reset, (descripcion) => {
    rl.question(colors.cyan + 'Ingrese el monto del gasto: ' + colors.reset, (monto) => {
      monto = monto.replace('$', '');
      const montoFloat = parseFloat(monto);
      if (!isNaN(montoFloat)) {
        const gasto = {
          descripcion: descripcion,
          monto: montoFloat
        };
        guardarGasto(gasto);
      } else {
        console.log(colors.red + 'El monto ingresado no es válido. Por favor, ingrese un número válido.' + colors.reset);
        mostrarMenu();
      }
    });
  });
}

function guardarGasto(gasto) {
  leerGastos((gastos) => {
    gastos.push(gasto);
    fs.writeFile(archivoGastos, JSON.stringify(gastos, null, 2), 'utf8', (err) => {
      if (err) {
        console.error(colors.red + 'Error al guardar el gasto:' + err + colors.reset);
        return;
      }
      console.log(colors.bright + 'Gasto registrado exitosamente.' + colors.reset);
      mostrarMenu();
    });
  });
}

function verGastos() {
  leerGastos((gastos) => {
    if (gastos.length === 0) {
      console.log(colors.bright + 'No hay gastos registrados.' + colors.reset);
    } else {
      console.log(colors.bright + '\n--- Lista de Gastos ---\n');
      gastos.forEach((gasto, index) => {
        console.log(`[${index + 1}] Descripción: ${gasto.descripcion}, Monto: ${gasto.monto}`);
      });
    }
    mostrarMenu();
  });
}

function leerGastos(callback) {
  fs.readFile(archivoGastos, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.writeFile(archivoGastos, '[]', 'utf8', (err) => {
          if (err) {
            console.error(colors.red + 'Error al crear el archivo de gastos:' + err + colors.reset);
          }
          callback([]);
        });
      } else {
        console.error(colors.red + 'Error al leer el archivo de gastos:' + err + colors.reset);
        callback(null);
      }
    } else {
      callback(JSON.parse(data));
    }
  });
}

mostrarMenu();
