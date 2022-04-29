
import { RequestHandler } from 'express';
import Controller from './Controller';
import UsersDbClass from '../db/Users';
import Jwt from '../utils/Jwt';
import * as fs from 'fs';
import { stringify } from 'csv-stringify';
import csv = require('csv-parser');


class InstagramController extends Controller {
    protected readonly jwt: Jwt

    public constructor(
        users: UsersDbClass,
    ) {
        super('/giweaway', users);

        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router.get('/', this.runScript);
        this.router.post('/ip', this.findMyIp);
    };

    private runScript: RequestHandler = async (req, res) => {
        console.time("dbsave");

        const out0 = fs.readFileSync('./storage/out0.txt').toString().split('\n');
        const out1 = fs.readFileSync('./storage/out1.txt').toString().split('\n');
        const out2 = fs.readFileSync('./storage/out2.txt').toString().split('\n');
        const out3 = fs.readFileSync('./storage/out3.txt').toString().split('\n');
        const out4 = fs.readFileSync('./storage/out4.txt').toString().split('\n');
        const out5 = fs.readFileSync('./storage/out5.txt').toString().split('\n');
        const out6 = fs.readFileSync('./storage/out6.txt').toString().split('\n');
        const out7 = fs.readFileSync('./storage/out7.txt').toString().split('\n');
        const out8 = fs.readFileSync('./storage/out8.txt').toString().split('\n');
        const out9 = fs.readFileSync('./storage/out9.txt').toString().split('\n');
        const out10 = fs.readFileSync('./storage/out10.txt').toString().split('\n');
        const out11 = fs.readFileSync('./storage/out11.txt').toString().split('\n');
        const out12 = fs.readFileSync('./storage/out12.txt').toString().split('\n');
        const out13 = fs.readFileSync('./storage/out13.txt').toString().split('\n');
        const out14 = fs.readFileSync('./storage/out14.txt').toString().split('\n');
        const out15 = fs.readFileSync('./storage/out15.txt').toString().split('\n');
        const out16 = fs.readFileSync('./storage/out16.txt').toString().split('\n');
        const out17 = fs.readFileSync('./storage/out17.txt').toString().split('\n');
        const out18 = fs.readFileSync('./storage/out18.txt').toString().split('\n');
        const out19 = fs.readFileSync('./storage/out19.txt').toString().split('\n');


        const combined = [
            ...new Set(out0),
            ...new Set(out1),
            ...new Set(out2),
            ...new Set(out3), ...new Set(out4), ...new Set(out5),
            ...new Set(out6), ...new Set(out7), ...new Set(out8), ...new Set(out9), ...new Set(out10),
            ...new Set(out11), ...new Set(out12), ...new Set(out13), ...new Set(out14), ...new Set(out15),
            ...new Set(out16), ...new Set(out17), ...new Set(out18), ...new Set(out19)
        ];

        const unique = [... new Set(combined)]

        let sorted_arr = combined.slice().sort();
        console.log('unique  ' + unique.length);

        let count = {};
        const inten = []
        const all = []


        for (var i = 0; i < sorted_arr.length; i++) {
            var item = sorted_arr[i];
            count[item] = count[item] >= 1 ? count[item] + 1 : 1;
            if (count[item] === 10) {
                inten.push(item);
            }
            if (count[item] === 20) {
                all.push(item);
            }
        }
        console.log(' in ten ' + inten.length);
        console.log(' in all ' + all.length);
        console.timeEnd("Time")

        res.status(200).json('OK')
    };


    private findMyIp: RequestHandler = async (req, res) => {
        const { ip } = req.body;
        console.log(ip);
        
        fs.createReadStream('storage/IP2LOCATION-LITE-DB1 (1).csv')
            .pipe(csv())
            .on('data', (row) => {
                console.log(row);
            })
            .on('end', () => {
                console.log('CSV file successfully processed');
            });
            res.status(200).json('ok');
    };

}

export default InstagramController;
