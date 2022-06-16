class FormPrint {
    constructor (formId, alertId, href) {
        this.formEl = document.getElementById(formId);
        this.alertEl = document.getElementById(alertId);
        this.href = href;

        this.submit();
        
    }

    submit () {
       if (this.formEl) {
        this.formEl.addEventListener('submit', async event => {
            event.preventDefault();
            const submitBtn = (event.submitter) ? event.submitter : event.explicitOriginalTarget;
            const { data, isValid } = this.fieldValidity();
            
            let options = {
                method: event.target.method,
                body: JSON.stringify(data),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            };
            
            const request = new Request(event.target.action, options);

            if (!isValid) return this.alert({ message: 'Marque pelo menos uma opção.', success: false }, false, this.alertEl);
            
            submitBtn.disabled = true;
            
            await fetch(request).then(response => {
                response.json().then(data => {
                    if (this.href && data.success) return window.location.href = this.href + `/${(data.codigo_turma) ? data.codigo_turma : false }/${(data.nome_curso) ? data.nome_curso : false }/${(data.codigo_curso) ? data.codigo_curso : false }/${(data.turno) ? data.turno : false }/${(data.ano_lectivo) ? data.ano_lectivo : false }/${(data.matriculas) ? data.matriculas : false }/${(data.data_cadastro) ? data.data_cadastro: false }/${(data.nivel) ? data.nivel: false }`; 
                    console.log(data)
                    this.alert(data, event, this.alertEl);
                    
                }).catch(error => {
                    console.log(error)
                    this.alert(error, event, this.alertEl);
                })
            }).catch(error => {
                console.log(error)

                this.alert(error, event, this.alertEl);
            })
            
            submitBtn.disabled = false;

            return

            
        });
       }
    }

    fieldValidity () {
        let isValid = false;
        const data = {};

        [...this.formEl.elements].forEach(field => {

            if (field.checked) {
                isValid = true;
            } 
            
            if (field.checked) data[field.name] = field.value

        });

        return { data, isValid }
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

    
}
