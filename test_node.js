const { ParkingCalculator } = require('./rngp_2025_11_17/mainEngine.js');

// Mock window and parkingData
global.window = {
    parkingData: {
        ev_share: [
            { year: 2025, share: 0.05 },
            { year: 2026, share: 0.08 },
            { year: 2027, share: 0.15 }
        ],
        districts: {
            'Test District': [1.0, 1.0]
        },
        infrastructure: {
            metro: true
        }
    }
};

// Mock data
const inputData = {
    areaFlats: 10000,
    areaNNP: 500,
    areaSchool: 0,
    areaPreschool: 0,
    k1: 1.0,
    k2: 1.0,
    districtName: 'Test District',
    ttkStatus: 'outside',
    metroDistance: 500,
    rnsYear: 2028, // > 2027 for EV share
    fact_zu_mo: 0,
    fact_zu_guest_mgn: 0,
    fact_zu_priob_mgn: 0,
    fact_uds_mo: 0,
    fact_uds_guest: 0,
    fact_uds_guest_mgn: 0,
    fact_uds_priob: 0,
    fact_uds_priob_mgn: 0
};

const calc = new ParkingCalculator(inputData);
calc.calculate();
console.log(calc.getFormattedReport());
