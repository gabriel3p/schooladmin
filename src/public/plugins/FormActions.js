class FormActions {
    constructor (formId, alertId) {
        this.formEl = document.getElementById(formId);
        this.alert = document.getElementById(alertId);

        this.initialize();
    }

    initialize () {
        let select_actions = document.getElementById('select_accoes');
        let btn_apply = document.getElementById('btn_aplicar');

        

        select_actions.addEventListener('change', () => {
            
            const { haveData } = this.verifyFields();
            select_actions.style.borderColor = 'green';

            if (haveData) {
                btn_apply.setAttribute('data-bs-toggle', 'modal');

                switch(select_actions.value) {
                    case 'DS':
                        btn_apply.setAttribute('data-bs-target', '#modal_deletar_selecionados');
                    break;
                    case 'GLP':
                        btn_apply.setAttribute('data-bs-target', '#modal_gerar_list_presenca');
                    break;
                }
            }
            
        })
        
        btn_apply.addEventListener('click', async event => {
            event.preventDefault();
           
            const { data, fieldAction, haveData, totalCheck } = this.verifyFields();
           /* let options = {
                method: 'POST',
                body: JSON.stringify(data),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            };*/
            
            if (!fieldAction) {
                select_actions.style.borderColor = 'red';
            }
            
            if (!haveData) return 

            
            if (data.length < totalCheck && data.includes('all')) {
                data.forEach((value, index)=> {
                    if (value == 'all') {
                        data.splice(index, 1);
                    }
                });
            }

            switch(fieldAction.value) {
                case 'DS':
                    this.deleteSelected(data);
                break;

                case 'GLP':
                    this.presenceList(data)
                break;
            }

        });
       
    }

    verifyFields () {

       let haveData = false;
        const data = [];
        let fieldAction = '';
        let totalCheck = 0;

        [...this.formEl.elements].forEach(field => {
            
            if (field.type === 'checkbox') { //Contianuar com essa lógica
                totalCheck++; 
                if (field.checked) {
                    data.push(field.value)
                    haveData = true
                }
            }
            
            
            if (field.name === 'accao') {
                if (field.value) {
                    fieldAction = field; 
                } 
            } 

        });

        return { data, fieldAction, haveData, totalCheck }

    }

    deleteSelected (data) {
        let modalTitle = document.getElementById('select_modal')
        let divInput = document.getElementById('select_inputs');
        let elements = '';

        modalTitle.innerHTML = 'Tem certeza que quer eliminar a turma selecionada?';

        data.forEach(value => {
            elements += `
                <input type="hidden" name="turmas" value="${ value }"/>
            `;
        });

        if (data.includes('all')) {
            modalTitle.innerHTML = 'Tem certeza que quer eliminar todas as turmas?'
        } else if (data.length > 1) {
            modalTitle.innerHTML = 'Tem certeza que quer eliminar as turmas selecionadas?'
        }

        divInput.innerHTML = elements;
        elements = ''
    }

    presenceList (data) {
        let divInput = document.getElementById('input_turmas');
        let elements = '';

        data.forEach(value => {
            elements += `
                <input type="hidden" name="turmas_id" value="${ value }"/>
            `;
        });

        divInput.innerHTML = elements;
        elements = ''

    }
}




/**
 * 
Alterar Situação das Matrículas Selecionadas = ASM
Gerar Carta de Estágio = GCE
Gerar Circular de Documentos Pendentes = GCDP
Gerar Declaração com Notas = GDN
Gerar Boletim de Notas = GBN
Deletar Matrículas Selecionados = DS


Deletar selecionados = DS
Gerar lista de Presença = GLP
Gerar Mini Pautas = GMP
 *  
 */