const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const moment = require('moment');
moment.locale('pt-BR');

module.exports = {
    deletePhoto (entity) {
        
       if (entity.genero) {
            if (entity.genero.toLowerCase() === 'm') {
                if (!entity.foto.split('/').includes('avatar04.png')) {
                return promisify (fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', entity.foto));
                } 
            } else {
                if (!entity.foto.split('/').includes('avatar2.png')) {
                return promisify (fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', entity.foto));
                }
            } 

            return 
       } 
        console.log(entity)
       return promisify (fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', entity.foto));
        
    },

    generateCode () {
        const value = require('crypto')
            .randomBytes(4)
            .toString('hex');

        return value.toUpperCase();
    },

    setDate (date) {
        return moment(date).format('DD [de] MMMM [de] YYYY')
    },

    setTime (date) {
        return moment(date).format('DD[/]MM [-] HH[:]mm')
    },

    createMonth (modal) {
       try {
            const months = [
                //'Janeiro',
                {pos: 0, mes:'Fevereiro'},
                {pos: 1, mes:'Março'},
                {pos: 2, mes:'Abril'},
                {pos: 3, mes:'Maio'},
                {pos: 4, mes:'Junho'},
                {pos: 5, mes:'Julho'},
                {pos: 6, mes:'Agosto'},
                {pos: 7, mes:'Setembro'},
                {pos: 8, mes:'Outubro'},
                {pos: 9, mes:'Novembro'},
                {pos: 10, mes:'Dezembro'}
            ];

            months.forEach(async (month, index) => {
                if (!await modal.findOne({ where: { mes: month.mes } })){
                    await modal.create({ mes: month.mes, pos: month.pos });
                }
            });
       } catch (error) {
           console.log('Erro ao criar os meses ' + error);
       }
    }
}