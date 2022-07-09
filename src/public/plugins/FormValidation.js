class FormValidation {
    constructor (formId, alertId, studentForm, href) {
        this.formEl = document.getElementById(formId);
        this.alertEl = document.getElementById(alertId);
        this.studentForm = studentForm;
        this.href = href;
        this.isValid = true;

        this.submit();
        this.reset();
        this.closeAlert(this.alertEl);
    }


    submit () {
        this.formEl.addEventListener('submit', async event => {
            event.preventDefault();
            const submitBtn = (event.submitter) ? event.submitter : event.explicitOriginalTarget;
            const { data, isValid, fieldFile } = this.fieldsVAlidation();

           
            const formData = new FormData(this.formEl);
            let options = {
                method: event.target.method,
                body: JSON.stringify(data),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            };

           

            if (fieldFile) {
                options = {
                    method: event.target.method,
                    body: formData,
                }
            } 
            
            const request = new Request(event.target.action, options);

            if (!this.isValid) return false;

            submitBtn.disabled = true;
            
            await fetch(request).then(response => {
                response.json().then(data => {
                    if (this.href && data.success) return window.location.href = this.href; 
                    this.alert(data, event, this.alertEl);
                }).catch(error => {
                    console.log(error)
                    this.alert({ message: 'Houve um erro ao enviar os dados, tente novamente' } , event, this.alertEl);
                })
            }).catch(error => {
                console.log(error)

                this.alert(error, event, this.alertEl);
            })
            
            submitBtn.disabled = false;

            return
        });
    }

    reset () {
        this.formEl.addEventListener('reset', () => {
            let imgEl = this.formEl.querySelector('#photo_student');

            if (imgEl) {
                imgEl.src = "/assets/img/undraw_male_avatar_323b.svg";
            }
        });
    }

    async autoReset (event) {
        let imgEl = event.querySelector('#photo_student');
        await event.classList.remove("was-validated");

        if (imgEl) {
            imgEl.src = "/assets/img/undraw_male_avatar_323b.svg";
        }
            
        event.reset();
    }

    fieldsVAlidation () {
        this.isValid = true;
        let fieldFile = false;
        const data = {};
        const names = [
            'contacto',
            'usuario',
            'bi',
            'telefone',
            'phone1',
            'phone2',
            'email'
        ];

        [...this.formEl.elements].forEach(field => {

            if (['data_nascimento'].indexOf(field.name) > -1 && field.validity.valid) this.birthValidation(field);

            if (['bi'].indexOf(field.name) > -1 && field.validity.valid) this.biValidation(field);

            if (field.type == 'text' && field.validity.valid && !names.includes(field.name)/*field.name != 'contacto' && field.name != 'usuario' && field.name != 'bi' && field.name != 'telefone' && field.name != 'phone1' && field.name != 'phone2'*/) {
                if (!this.textValidation(field)) this.isValid = false;
            }
            
            if (!field.validity.valid) {
                this.isValid = false;
            }

            if (field.type === 'file') {
                fieldFile = true;
            } 
            
            if (field.name && field.name != 'bolderon') data[field.name] = field.value
            

        });

        return { data, fieldFile};

    }

    textValidation (field) {
        let isNumbers = true;
        const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        let values = field.value.split('');
        let msg = (field.parentElement.querySelector('.invalid-tooltip')) ? field.parentElement.querySelector('.invalid-tooltip') : field.parentElement.querySelector('.invalid-feedback');


        values.forEach((value, index) => {
            if (numbers.includes(value)) {
                isNumbers = false;
            } 
            
        });

        if(!isNumbers) {
            msg.style.display = 'block';
            field.classList.add('invalid3p')
            msg.innerHTML = 'Este campo não pode conter números.';
            return false
        } else {
            if (msg) {
                msg.style.display = 'none';
                field.classList.remove('invalid3p')
            }
            return true
        }
    }

    biValidation (field) {
        let validBI = true;
        let isNumbers = true;

        let values = field.value.split('');
        let msg = (field.parentElement.querySelector('.invalid-tooltip')) ? field.parentElement.querySelector('.invalid-tooltip') : field.parentElement.querySelector('.invalid-feedback');

        let letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'f', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        let number = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']



       values.forEach((value, index) => {
           if (index == 9 || index == 10) {
               if (!letter.includes(value.toLowerCase())) validBI = false;
           } else {
                if (!number.includes(value)) {
                    isNumbers = false;
                } 
           }
       });


      if(!validBI || !isNumbers) {
        msg.style.display = 'block';
        field.classList.add('invalid3p')
        msg.innerHTML = 'Por favor introduza um número do BI válido.';
        this.isValid = false

      } else {
        msg.style.display = 'none';
        field.classList.remove('invalid3p')
        this.isValid = true
      }
      
    }

    birthValidation (field) {
            let year = new Date().getFullYear();
            let birth = (field.parentElement.querySelector('.invalid-tooltip')) ? field.parentElement.querySelector('.invalid-tooltip') : field.parentElement.querySelector('.invalid-feedback');

            let birthYear = field.value.split('-').map(item => {
                if (item.length === 4) {
                    return parseInt(item); 
                } 
            });

            birth.style.display = 'block';
            this.isValid = false
                                            
            if (year - birthYear[0] < 15  && this.studentForm) {

                birth.innerHTML = "A idade mínima para se matricular é de 15 anos";

            } else if (year - birthYear[0] > 60 && this.studentForm) {

                birth.innerHTML = "A idade máxima para se matricular é de 60 anos";

            } else if (year - birthYear[0] < 18  && !this.studentForm) {

                birth.innerHTML = "A idade mínima para o registro de funcionários é de 15 anos";

            } else if (year - birthYear[0] > 60 && !this.studentForm) {

                birth.innerHTML = "A idade máxima para o registro de funcionários é de 60 anos";

            } else if (!(year - birthYear[0]) || typeof (year - birthYear[0]) === undefined || year - birthYear[0] === null) {

                birth.innerHTML = "Por favor introduza uma data válida.";

            } else {
                field.classList.remove('invalid3p')
                birth.style.display = 'none';
                this.isValid = true
                return  

            }

            field.classList.add('invalid3p')
    }

    alert (data, event, alertEl) {
        alertEl.querySelector('span').innerHTML = data.message;
        alertEl.classList.add('show');
        
        
        if (data.success) {
            alertEl.classList.remove('alert-danger');
            alertEl.classList.remove('bg-danger');

            alertEl.classList.add('alert-success');
            alertEl.classList.add('bg-success');

            if (event) {
                this.resetTable(event.target);
                this.autoReset(event.target);
            }
        } else {
            alertEl.classList.remove('alert-success');
            alertEl.classList.remove('bg-success');

            alertEl.classList.add('alert-danger');
            alertEl.classList.add('bg-danger');
        }

        return setTimeout(() => {
            alertEl.classList.remove('show');
        }, 5000);
    }

    closeAlert (alert) {
        alert.querySelector('button').onclick = () => {
            alert.classList.remove('show');
            clearTimeout();
        }
    }

    resetTable (formEl) {
        let tBody = formEl.querySelector('tbody');
        if (tBody) {
            tBody.innerHTML = '';
        }
    }
}