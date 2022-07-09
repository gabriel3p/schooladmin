class FormFilter {
    constructor (formId, alertId, corfirmForm) {
        this.formEl = document.getElementById(formId);
        this.alertEl = document.getElementById(alertId);
        this.tbody = document.getElementById('filtros');
        this.confirmForm = corfirmForm;
        this.element = '';

        this.showFormEditCurso();
        this.submit();
    }

    submit () {
        this.formEl.addEventListener('submit', async event => {
            event.preventDefault();

            const submitBtn = (event.submitter) ? event.submitter : event.explicitOriginalTarget;

            const data = this.getValues();
            
            const request = new Request(event.target.action, {
                method: event.target.method,
                body: JSON.stringify(data),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            });

            submitBtn.disabled = true;

            await fetch(request).then(response => {
                response.json().then(data => {
                    this.element = '';

                    if (data.alunos) this.showAlunoData(data);

                    if (data.turmasProfessor) this.showTurmasProfessor(data);

                    if (data.funcionarios) this.showFuncData(data.funcionarios);

                    if (data.cursos) this.filterCursoData(data);

                    if (data.turmas) this.showTurmasData(data);

                    if (data.feedbacks) this.showFeedbacksData(data);

                    if (data.matricula && !this.confirmForm) this.showMatriculaData(data);

                    if (data.matricula && this.confirmForm) this.showMatriculaDataToConfirm(data);

                    if (!data.success) this.alerta(data.message, event);
                    

                }).catch(error => {
                    this.alerta(error, event);
                })
            }).catch(error => {
                this.alerta(error, event);
            })
            
            submitBtn.disabled = false;

            return
        });
    }

    alerta(data, event) {
        
        this.alertEl.querySelector('span').innerHTML = data;
        
        
        if (data) {
            this.alertEl.classList.add('show');
            if (data.success) {
                this.alertEl.classList.remove('alert-danger');
                this.alertEl.classList.remove('bg-danger');

                this.alertEl.classList.add('alert-success');
                this.alertEl.classList.add('bg-success');

            } else {
                this.alertEl.classList.remove('alert-success');
                this.alertEl.classList.remove('bg-success');

                this.alertEl.classList.add('alert-danger');
                this.alertEl.classList.add('bg-danger');
            }
        }

        return setTimeout(() => {
            this.alertEl.classList.remove('show');
        }, 5000);
    }

    showMatriculaDataToConfirm (data) {
        const { matricula } = data;

        const trimestres = ['I', 'II', 'III'];
        const medias = {};
        let totNotasEcontradas = 0;

        const formConfirm = document.getElementById('form-confirm');
        const matriculaData = document.querySelectorAll('.outros-dados');
        const error_payment = document.querySelector('.error_payment');
        const error_notes = document.querySelector('.error_notes');


        let photo = document.getElementById('photo_student');

        const mesActual = new Date().toLocaleDateString('pt-br', { month: 'long', });
        let no_inamdiplete = false;

        matricula.pagamentos.forEach((pagamento, index)=> {
            if (pagamento.mes.mes.toLowerCase() == mesActual.toLowerCase()) no_inamdiplete = true;
        })

        trimestres.forEach(trimestre => {
            let media = 0;
            let totNotas = 0;
            matricula.notas.forEach(nota => {
                if (nota.trimestre == trimestre && nota.prova1 && nota.prova2) {
                    totNotasEcontradas += 1;
                    totNotas += 1;
                    media += (parseFloat(nota.prova1 ) + parseFloat(nota.prova2)) / 2;
                }
            });
            medias[trimestre] = media / totNotas;
        });

        let mediaFinal = (medias.I + medias.II + medias.III) / 3;
           
        console.log(medias)
        console.log(mediaFinal)

        if (matricula) {

            error_payment.style.display = 'block';
            if (matriculaData) {
                matriculaData.forEach(element => {
                    element.style.display = 'none';
                });
            }          

            if (no_inamdiplete) {

                if (matriculaData) {
                    matriculaData.forEach(element => {
                        element.style.display = 'block';
                    });
               }

               error_payment.style.display = 'none';
            }

            if (totNotasEcontradas != matricula.notas.length) {

                error_notes.innerHTML = 'Só será possível fazer a confirmação<br> quando todas as notas forem atribuidas';
                error_notes.style.display = 'block'

                if (matriculaData) {
                    matriculaData.forEach(element => {
                        element.style.display = 'none';
                    });
                } 

           } else {
                error_notes.style.display = 'none'
           }

            photo.src = `/files/${ matricula.aluno.foto }`;

            [...formConfirm.elements].forEach(field => {
                if (field.disabled) {

                    if (field.name == 'genero') {
                        field.value = (matricula.aluno[field.name].toLowerCase() == 'm') ? 'Masculino' : 'Feminino';
                    } else {
                        field.value = matricula.aluno[field.name]
                    }
                }

                if (field.name == 'aluno_id') {
                    field.value = matricula.aluno.id;
                }
            });

        } else {
            if (matriculaData) {
                matriculaData.forEach(element => {
                    element.style.display = 'none';
                });
            }

            photo.src = `/assets/img/undraw_male_avatar_323b.svg`;

            [...formConfirm.elements].forEach(field => {
                if (field.disabled) {
                    field.value = ''
                }
                if (field.name == 'aluno_id') {
                    field.value ='';
                }
            });
        }

    }

    showTurmasProfessor (data) {
        const { turmasProfessor, professor } = data;

        turmasProfessor.forEach(turma => {
            turma.classe.disciplinas.forEach(disciplina => {
                disciplina.professores.forEach(prof => {
                    if (professor == prof.id) {
                        this.element += `
                            <tr>
                                <td>
                                    <input type="checkbox" class="form-check-input" name="turmas_id" value="${ turma.id }" id="">
                                     ${disciplina.nome_disciplina }
                                </td>
                                
                                <td>
                                ${ prof.nome  } ${prof.sobrenome }
                                </td>
                    
                                <td>
                                    ${ turma.classe.curso.nome }
                                </td>
                    
                                <td>
                                    ${ turma.classe.nivel }ª
                                </td>
                    
                                <td>
                                    ${ turma.codigo_turma }
                                </td>
                    
                                <td>
                                    ${turma.matriculas.length }
                                </td>
                    
                                <td class="action_links">
                                    <a style="color: #2e9b2e" href="/admin/turmas/pauta/${ disciplina.id }/${ turma.id }" title="Notas" class="bi bi-pencil-square"></a>
                                </td>
                        </tr>
                        `
                    }
                });
            });
        });

        this.tbody.innerHTML = this.element;
    }

    showAlunoData (data) {
        const { funcionario, alunos } = data;
        console.log(alunos)

        let pagination = document.querySelector('.pagination');

        pagination.style.display = 'none';

        alunos.forEach(aluno => {
            this.element += `
            
                        <tr class=" ${(aluno.matriculas[aluno.matriculas.length - 1].estado_matricula == 'pendente') ? 'alert alert-warning' : '' }  ${(aluno.matriculas[aluno.matriculas.length - 1].estado_matricula == 'recusada') ? 'alert alert-danger' : ''} ">
                        <td>
                        <input type="checkbox" class="form-check-input" name="aluno_id" value="${aluno.id }" id="">
                         ${aluno.nome }
                        </td>

                        <td>
                         ${aluno.phone1 }
                        </td>

                        <td>
                        ${ aluno.matriculas[aluno.matriculas.length - 1].codigo_matricula }
                        </td>

                        <td>
                        ${ aluno.matriculas[aluno.matriculas.length - 1].classe[0].nivel }ª
                        </td>

                        <td>
                            ${ (aluno.matriculas[aluno.matriculas.length - 1].classe[0]) ? aluno.matriculas[aluno.matriculas.length - 1].classe[0].curso.nome  : '' }
                        </td>

                        <td>
                         ${aluno.matriculas[aluno.matriculas.length - 1].turma[0].codigo_turma }
                        </td>

                        <td class="action_links">
                        <a href="/admin/alunos/aluno/${aluno.id}" style="color: #0099ff; title="Visualizar perfil do aluno"><i class="bi bi-eye-fill"></i></a>

                        ${ 
                            (aluno.matriculas[aluno.matriculas.length - 1].estado_matricula == 'pendente' || aluno.matriculas[aluno.matriculas.length - 1].estado_matricula == 'recusada') 

                            ? ` <a style="color: #2e9b2e" href="#" data-bs-toggle="modal" data-bs-target=".modal_editar_matricula_${ aluno.matriculas[aluno.matriculas.length - 1].id }" title="Editar matrícula" class="bi bi-pencil-square"></a>`

                            : ''
                        }

                        ${
                            (funcionario.cargo.toLowerCase() == 'diretor')

                            ? `<a href="#" data-bs-toggle="modal" data-bs-target=".modal_deletar_${ aluno.id }" title="Deletar aluno"><i class="bi bi-trash-fill"></i></a>`

                            : ''
                        }
                        </td>

                    </tr>

                    <div class="modal fade modal_deletar_${ aluno.id }" id="" tabindex="-1" aria-hidden="true" style="display: none;">
                        <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                            <h5 class="modal-title">Tem certeza que quer eliminar este Aluno?</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-footer">
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Não</button>
                            <a href="/admin/alunos/${ aluno.id }/deletar"><button type="button" class="btn btn-danger">Sim</button></a>
                            </div>
                        </div>
                        </div>
                    </div><!-- Fim Modal DEletar curso --> 

                    <div class="modal fade modal_editar_matricula_${ aluno.matriculas[aluno.matriculas.length - 1].id }" id="" tabindex="-1" aria-hidden="true" style="display: none;">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Editar Estado da Matrícula</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                            <form id="form_stateMatri" method="post" action="/admin/matriculas/alterar/matricula">
                            
                            <div class="modal-body row">

                                <div class="bolderon_img col-12">
                                <a href="/files/${ aluno.matriculas[aluno.matriculas.length - 1].bolderon }" target="_blanc">
                                    <img src="/files/${ aluno.matriculas[aluno.matriculas.length - 1].bolderon }" alt="">
                                </a>
                                </div>

                                <div class="col-12">
                                <h6 class="form-label">Aluno: <span> aluno.nome </span></h6>
                                <h6 class="form-label">Código de Matrícula: 
                                    <span> 
                                       ${ aluno.matriculas[aluno.matriculas.length - 1].codigo_matricula }
                                    </span>
                                </h6>

                                </div>

                                <div class="col-12">
                                <label for="estado_matricula" class="form-label">Estado da Matrícula</label>
                                <select class="form-select" name="estado_matricula" id="estado_matricula">
                                    <option selected value="pendente">Pendente</option>
                                    <option value="ativa">Ativa</option>
                                    <option value="recusada">Recusada</option>
                                </select>
                                <input type="hidden" name="codigo_matricula" value="${ aluno.matriculas[aluno.matriculas.length - 1].codigo_matricula }">
                            </div>

                            </div>

                            <div class="modal-footer">
                                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                                <button type="submit" class="btn btn-success btn_saveState">Salvar</button>
                            </div>
                            </form>
                        </div>
                    </div>
                    </div><!-- Fim Modal DEletar curso -->
            
            `;
        });

        this.tbody.innerHTML = this.element;

    }

    showMatriculaData (data) {
        const { matricula } = data;
        let linhasDeNotasI = ''
        let linhasDeNotasII = ''
        let linhasDeNotasIII = ''
        let linhaPropina = '';

        const mesActual = new Date().toLocaleDateString('pt-br', { month: 'long', });
        let no_inamdiplete = false;

        const avatar_group = document.querySelector('#avatar_group');
        const about_student = document.querySelector('#about_student');

        let avatarImg = document.querySelector('#ilustration_avatar')

        if (matricula.length < 1) {
            about_student.innerHTML = '';
            avatar_group.style.display = 'block';

            avatarImg.src = "/assets/img/undraw_not_found_-60-pq.svg"
            document.querySelector('#avatar_message').style.display = 'block'

            return console.log('encontrou nada!')
        }

        avatar_group.style.display = 'none';
        about_student.style.display = 'block';

        matricula.notas.forEach(nota => {
            if (nota.trimestre == 'I') {
                linhasDeNotasI += `
                        <tr>
                            <th scope="row">${nota.disciplina.nome_disciplina}</th>
                            <td>${nota.prova1 || '---'}</td>
                            <td>${nota.prova2 || '---'}</td>
                            <td>${(nota.prova1 > 0 && nota.prova2 > 0) ? (nota.prova1 + nota.prova2) / 2 || '---' : '---'}</td>
                        </tr>
                    `;
            }

            if (nota.trimestre == 'II') {
                linhasDeNotasII += `
                        <tr>
                            <th scope="row">${nota.disciplina.nome_disciplina}</th>
                            <td>${nota.prova1 || '---'}</td>
                            <td>${nota.prova2 || '---'}</td>
                            <td>${(nota.prova1 > 0 && nota.prova2 > 0) ? (nota.prova1 + nota.prova2) / 2 || '---' : '---'}</td>
                        </tr>
                    `;
            }

            if (nota.trimestre == 'III') {
                linhasDeNotasIII += `
                        <tr>
                            <th scope="row">${nota.disciplina.nome_disciplina}</th>
                            <td>${nota.prova1 || '---'}</td>
                            <td>${nota.prova2 || '---'}</td>
                            <td>${(nota.prova1 > 0 && nota.prova2 > 0) ? (nota.prova1 + nota.prova2) / 2 || '---' : '---'}</td>
                        </tr>
                    `;
            }
                
        });

       matricula.pagamentos.forEach((pagamento, index)=> {

        if (pagamento.mes.mes.toLowerCase() == mesActual.toLowerCase()) no_inamdiplete = true;

            linhaPropina +=  `
                    <tr>
                        <th scope="col">${ index + 1 }</th>
                        <td>${ pagamento.mes.mes }</td>
                        <td style="text-transform: capitalize;">${ pagamento.forma_pagamento }</td>
                        <td style="text-transform: capitalize;">${ pagamento.funcionario.nome  } ${ pagamento.funcionario.sobrenome }</td>
                        <td style="text-transform: capitalize;">${ pagamento.createdAt }</td>
                    </tr>

                `

        })


        about_student.innerHTML = `
                        <div class="col-sm-12 col-md-4" align="center">
                            <div  data-aos="fade-right">
                                <div class="profile-card pt-4 d-flex flex-column align-items-center">

                                <img src="/files/${ matricula.aluno.foto }" class="img-fluid" alt="Foto do Estudante">
                                
                                </div>
                            </div>

                        </div>

                        <div class="col-sm-12 col-md-8" align="center">

                        <div  data-aos="fade-left">
                            <div class="pt-3">
                        
                            <ul class="nav nav-tabs nav-tabs-bordered about__student-tabs" align="center" >

                                <li class="nav-item">
                                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#profile-overview">Dados do Aluno</button>
                                </li>

                                <li class="nav-item">
                                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#profile-edit">Mapa de Notas</button>
                                </li>

                                <li class="nav-item">
                                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#profile-settings">Propinas</button>
                                </li>

                            </ul>
                            <div class="tab-content pt-2 about__student-info" align="left">

                                <div class="tab-pane fade show active profile-overview" id="profile-overview">
                                

                                <!-- Default Accordion -->
                                <div class="accordion" id="accordionExample">
                                  <div class="accordion-item">
                                    <h2 class="accordion-header" id="dadosPessoais">
                                      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDadosPessoais" aria-expanded="true" aria-controls="collapseDadosPessoais">
                                        <h5 class="card-title">Dados Pessoais</h5>
                                      </button>
                                    </h2>
                                    <div id="collapseDadosPessoais" class="accordion-collapse collapse show" aria-labelledby="dadosPessoais" data-bs-parent="#accordionExample">
                                      <div class="accordion-body">
                                        
                                      <div class="row">
                                      <div class="col-lg-3 col-md-4 label ">Nome completo</div>
                                      <div class="col-lg-9 col-md-8">${ matricula.aluno.nome }</div>
                                  </div>
  
                                  <div class="row">
                                      <div class="col-lg-3 col-md-4 label">Filho de</div>
                                      <div class="col-lg-9 col-md-8">${ matricula.aluno.nome_pai }</div>
                                  </div>
  
                                  <div class="row">
                                      <div class="col-lg-3 col-md-4 label">E de</div>
                                      <div class="col-lg-9 col-md-8">${ matricula.aluno.nome_mae }</div>
                                  </div>
  
                                  <div class="row">
                                      <div class="col-lg-3 col-md-4 label">Data de nascimento</div>
                                      <div class="col-lg-9 col-md-8">${ matricula.aluno.data_nascimento }</div>
                                  </div>
  
                                  <div class="row">
                                      <div class="col-lg-3 col-md-4 label">Gênero</div>
                                      <div class="col-lg-9 col-md-8">${ (matricula.aluno.genero.toLowerCase() == 'm') ? 'Masculino': 'Feminino' }</div>
                                  </div>
  
  
                                  <div class="row">
                                      <div class="col-lg-3 col-md-4 label">BI nº</div>
                                      <div class="col-lg-9 col-md-8">${ matricula.aluno.bi }</div>
                                  </div>
  
                                  <div class="row">
                                      <div class="col-lg-3 col-md-4 label">Naturalidade</div>
                                      <div class="col-lg-9 col-md-8">${ matricula.aluno.nacionalidade }</div>
                                  </div>
  
                                  <div class="row">
                                      <div class="col-lg-3 col-md-4 label">Município</div>
                                      <div class="col-lg-9 col-md-8">${ matricula.aluno.municipio }</div>
                                  </div>
  
                                  <div class="row">
                                      <div class="col-lg-3 col-md-4 label">Bairro</div>
                                      <div class="col-lg-9 col-md-8">${ matricula.aluno.bairro }</div>
                                  </div>
  
                                  <div class="row">
                                      <div class="col-lg-3 col-md-4 label">Email</div>
                                      <div class="col-lg-9 col-md-8">${ matricula.aluno.email }</div>
                                  </div>
  
                                  <div class="row">
                                      <div class="col-lg-3 col-md-4 label">Telefone</div>
                                      <div class="col-lg-9 col-md-8">${ matricula.aluno.phone1 }</div>
                                  </div>
  
                                  <div class="row">
                                      <div class="col-lg-3 col-md-4 label">Telefone 2</div>
                                      <div class="col-lg-9 col-md-8">${ matricula.aluno.phone2 }</div>
                                  </div>

                                      
                                        </div>
                                    </div>
                                  </div>

                                  <div class="accordion-item">
                                    <h2 class="accordion-header" id="dadosMatricula">
                                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDadosMatriculas" aria-expanded="false" aria-controls="collapseDadosMatriculas">
                                      <h5 class="card-title">Dados da Matricula</h5>
                                      </button>
                                    </h2>
                                    <div id="collapseDadosMatriculas" class="accordion-collapse collapse" aria-labelledby="dadosMatricula" data-bs-parent="#accordionExample">
                                        <div class="accordion-body">
                                            
                                                <div class="row">
                                                <div class="col-lg-3 col-md-4 label">Curso</div>
                                                <div class="col-lg-9 col-md-8">${ matricula.classe[0].curso.nome}</div>
                                            </div>
            
                                            <div class="row">
                                                <div class="col-lg-3 col-md-4 label">Turma</div>
                                                <div class="col-lg-9 col-md-8">${ matricula.turma[0].codigo_turma }</div>
                                            </div>
            
                                            <div class="row">
                                                <div class="col-lg-3 col-md-4 label">Turno</div>
                                                <div class="col-lg-9 col-md-8">${ (matricula.turma[0].turno.toLowerCase() == 'm') ? 'Manhã' : 'Tarde' }</div>
                                            </div>
            
                                            <div class="row">
                                                <div class="col-lg-3 col-md-4 label">Ano Lectivo</div>
                                                <div class="col-lg-9 col-md-8">${ matricula.ano_lectivo }</div>
                                            </div>
            
                                            <div class="row">
                                                <div class="col-lg-3 col-md-4 label">Classe</div>
                                                <div class="col-lg-9 col-md-8">${ matricula.classe[0].nivel }ª</div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                  </div>
                                  
                                </div><!-- End Default Accordion Example -->

                                </div>

                                <div class="tab-pane fade profile-edit pt-3" id="profile-edit">
                                <h6>Tabelas de notas</h6>
                                
                                        
                                <!-- Default Accordion -->
                                ${

                                    (no_inamdiplete) ? `
                                    
                                                <div class="accordion" id="accordionExample">
                                                <div class="accordion-item">
                                                <h2 class="accordion-header" id="headingOne">
                                                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                    Iº Trimestre
                                                    </button>
                                                </h2>
                                                <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                                    <div class="accordion-body">
                                                    
                                                    <table class="table table-striped student__notes" style="text-align: left;">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">Disciplina</th>
                                                                <th scope="col">1ª Prova</th>
                                                                <th scope="col">2ª Prova</th>
                                                                <th scope="col">Média</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            
                                                            ${ linhasDeNotasI }
                                                                    
                                                        </tbody>
                                                    </table>
            
                                                    
                                                    </div>
                                                </div>
                                                </div>
                                                <div class="accordion-item">
                                                <h2 class="accordion-header" id="headingTwo">
                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                    IIº Trimestre
                                                    </button>
                                                </h2>
                                                <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                                    <div class="accordion-body">
                                                    
                                                        <table class="table table-striped student__notes" style="text-align: left;">
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col">Disciplina</th>
                                                                    <th scope="col">1ª Prova</th>
                                                                    <th scope="col">2ª Prova</th>
                                                                    <th scope="col">Média</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                
                                                                ${ linhasDeNotasII }
                                                                        
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                </div>
                                                <div class="accordion-item">
                                                <h2 class="accordion-header" id="headingThree">
                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                    IIIº Trimestre
                                                    </button>
                                                </h2>
                                                <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                                    <div class="accordion-body">
                                                        <table class="table table-striped student__notes" style="text-align: left;">
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col">Disciplina</th>
                                                                    <th scope="col">1ª Prova</th>
                                                                    <th scope="col">2ª Prova</th>
                                                                    <th scope="col">Média</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                
                                                                ${ linhasDeNotasIII }
                                                                        
                                                            </tbody>
                                                        </table>  
                                                    </div>
                                                </div>
                                                </div>
                                            </div><!-- End Default Accordion Example -->
                                    
                                    
                                    ` : '<h1 class="error_payment">Por favor efetue o pagamento da propina<br> para visualizar as notas</h1>'

                                }
                                    
                                
                                </div>

                                <div class="tab-pane fade pt-3" id="profile-settings">

                                <h6>Propinas</h6>
                                
                                <table class="table table-hover" id="turmas">
                                <thead>
                                    <tr>
                                        <th scope="col">Nº</th>
                                        <th scope="col">Mês</th>
                                        <th scope="col">Forma de Pagamento</th>
                                        <th scope="col">Responsável</th>
                                        <th scope="col">Data de Pagamento</th>
                                    </tr>
                                </thead>
                                <tbody>
                                   
                                    ${ linhaPropina }
                                    
                                </tbody>
                                </table>

                                </div>

                            </div>

                            </div>
                        </div>
    
        `;

       
    }

    showFeedbacksData (data) {
        const { setTime, feedbacks } = data;
        let pagination = document.getElementById('pagination'); 


        if (feedbacks.length < 1) {
            this.element = `
                <h3 style="text-align: center;">Nenhum resultado encontrado!</h3>
            `;
        } else {
            feedbacks.forEach(feedback => {
                this.element += `
                    <tr class="lida_${ feedback.lida }">
                    <td>
                        <a class="feedback_item" href="/admin/feedbacks/${feedback.id}" style=" padding: .5rem 2rem .5rem 0;">
                            ${feedback.nome} 
                        </a>
                    </td>    
                    <td>${feedback.assunto} </td>    
                    <td>${feedback.contacto} </td>
                    <td>
                        <a href="#" style="color: #dd3535;" data-bs-toggle="modal" data-bs-target=".modal_deletar_${feedback.id}" title="Deletar feedback"><i class="bi bi-trash-fill"></i></a>  
                    </td>
                </tr>

                <div class="modal fade modal_deletar_${feedback.id}" id="" tabindex="-1" aria-hidden="true" style="display: none;">
                    <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title">Tem certeza que quer eliminar esta mensagem?</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Não</button>
                        <a href="/admin/feedbacks/${feedback.id} /deletar"><button type="button" class="btn btn-danger">Sim</button></a>
                        </div>
                    </div>
                    </div>
                </div>
                 `;
            });
        }

        
        
        this.tbody.innerHTML = this.element;
        pagination.style.display = 'none';

    }

    closeAlert (alert) {
        alert.querySelector('button').onclick = () => {
            alert.classList.remove('show');
            clearTimeout();
        }
    }

    getValues () {

        const data = {};

        [...this.formEl.elements].forEach(field => { 
            if (field.value) data[field.name] = field.value;            
        });

        return  data;

    }

    showFuncData (funcionarios) {
        const tbody = document.querySelector('#filtros');
        let element = ''; 

        funcionarios.forEach(funcionario => {
            element += `
                        <tr>
                        <td>${ funcionario.nome } ${ funcionario.sobrenome }</td>
                        <td>${ funcionario.cargo }</td>
                        <td>
                            <i style="font-size: .6rem; cursor: pointer;" class="bi bi-circle-fill active_${ funcionario.ativo }" title="${ (funcionario.ativo) ? "Ativo" : "Desativo" }"</i>
                        </td>
                        <td>${ funcionario.telefone }</td>
                        <td>${ funcionario.email }</td>
                        <td class="action_links">
                            <a href="/admin/perfil/${ funcionario.id }" title="Visualizar Perfil"><i class="bi bi-eye-fill"></i></a>
                            <a href="#" data-bs-toggle="modal" data-bs-target=".modal_deletar_${ funcionario.id }" title="Deletar Perfil"><i class="bi bi-trash-fill"></i></a>
                        </td>
                    </tr>
                    <div class="modal fade modal_deletar_${ funcionario.id }" id="" tabindex="-1" aria-hidden="true" style="display: none;">
                        <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                            <h5 class="modal-title">Tem certeza que quer eliminar esta Conta?</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-footer">
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Não</button>
                            <a href="/admin/${ funcionario.id }/eliminar-conta"><button type="button" class="btn btn-danger">Sim</button></a>
                            </div>
                        </div>
                        </div>
                    </div><!-- Fim Modal Eliminar Conta -->
            `;

        });

        tbody.innerHTML = element;
    }

    filterCursoData (data) {
        
            let filtro_curso = data.cursos.map((curso) => {
                
                if (curso.classes.length > 0) {
                    return curso
                }
    
                 
            });
            //console.log(filtro_curso)
            this.getCursosData(filtro_curso, data.funcionario)
        
    }

    getCursosData (cursos, funcionario) {
        this.tbody.innerHTML = '';
        cursos.forEach(async curso => {
            if (curso) {
                await fetch(`/admin/cursos/classe/pegar-dados/${ curso.id }`).then(async response => {
                    await response.json().then(data => {
                        const { curso } = data;
                        this.showCursoData({ curso, funcionario })
                    }).catch(error => {
                        console.log(error)
                        this.alerta('Houve um erro ao tentar buscar os dados', false);
                    })
                }).catch(error => {
                    console.log(error)
                    this.alerta('Houve um err durante a requisição', false);
                });
            }
        }); 

        this.element = '';
    }

    showCursoData (data) {
        
        const { curso, funcionario } = data;

        //console.log(funcionario)

        let totalTurmas = 0
        curso.classes.forEach(classe => { 
            totalTurmas += classe.turmas.length
        });

          this.element += `
                <tr>
                    <td style="text-transform: capitalize;">${curso.nome}</td>
                    <td>${curso.codigo_curso}</td>
                    <td>${totalTurmas}</td>
                    <td>${ curso.classes.length }</td>
                    <td class="action_links">
                        <a href="/admin/curso/${curso.codigo_curso}" data-bs-toggle="modal" data-bs-target=".modal_visualizar_${curso.codigo_curso}" title="Visualizar curso"><i class="bi bi-eye-fill"></i></a>
                        <a style="color: #2e9b2e" href="#" data-bs-toggle="modal" data-bs-target=".modal_editar" title="Editar curso" class="bi bi-pencil-square edit_btn"><span style="display: none;">${curso.id}</span></a>
                        ${ 
                            (funcionario.cargo.toLowerCase() == 'diretor') 
                            
                            ? `<a href="#" data-bs-toggle="modal" data-bs-target=".modal_deletar_${curso.codigo_curso}" title="Deletar curso"><i class="bi bi-trash-fill"></i></a>` 

                            : ''
                        }
                    
                        </td>
                </tr>

                <div class="modal fade modal_deletar_${curso.codigo_curso}" id="" tabindex="-1" aria-hidden="true" style="display: none;">
                    <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title">Tem certeza que quer eliminar este curso?</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Não</button>
                        <a href="/admin/cursos/${curso.codigo_curso}/deletar"><button type="button" class="btn btn-danger">Sim</button></a>
                        </div>
                    </div>
                    </div>
                </div><!-- Fim Modal DEletar curso --> 

                <div class="modal fade modal_visualizar_${curso.codigo_curso}" id="verticalycentered" tabindex="-1" style="display: none;" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title">Informações do Curso</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">

                        <div class="row mb-3">
                            <div class="col-lg-4 col-md-12 student__photo">
                            <div class="col-12">
                                <img src="/files/${curso.foto}" id="photo" alt="Capa do curso...">
                            </div>
                            </div>

                            <div class="col-lg-8 col-md-12">
                                <div class="d-flex col-12">
                                <div style="text-align: justify; margin-bottom: 0.1rem;" class="col-12">
                                    <span style="font-weight: bold;">Sigla:</span> 
                                    ${curso.codigo_curso}
                                </div>
                                </div>
                                
                                <div class="d-flex col-12">
                                <div style="text-align: justify; margin-bottom: 0.1rem;" class="col-12">
                                    <span style="font-weight: bold;">Nome do curso:</span> 
                                    ${curso.nome}
                                </div>
                                </div>

                                <div class="d-flex col-12">
                                <div style="text-align: justify;" class="col-12">
                                    <span style="font-weight: bold;">Descrição:</span> 
                                    ${curso.descrição}
                                </div>
                                </div>
                            </div>
                        </div>

                        
                        <div class="card-body col-12">
                            <h5 class="card-title">Classes, Disciplinas e Turmas</h5>
                            <div class="accordion accordion-flush" id="accordionFlushExample-${curso.codigo_curso}">
                            ${ curso.classes.forEach((classe, index) => {
                                `
                                
                                <div class="accordion-item">

                                <h2 class="accordion-header" id="flush-heading${classe.nivel}-${curso.codigo_curso}">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse${classe.nivel}-${curso.codigo_curso}" aria-expanded="false" aria-controls="flush-collapse${classe.nivel}-${curso.codigo_curso}">
                                    ${classe.nivel}ª Classe
                                    </button>
                                </h2>
                                <div id="flush-collapse${classe.nivel}-${curso.codigo_curso}" class="accordion-collapse collapse" aria-labelledby="flush-heading${classe.nivel}-${curso.codigo_curso}" data-bs-parent="#accordionFlushExample-${curso.codigo_curso}" style="">
                                    <div class="accordion-body" style="padding-left: 1rem;">
                                    <div class="col-12">
                                        <span style="font-weight: bold;">Propina: <code style="font-size: 1rem;">${classe.preco}</code>,00kz</span>
                                    </div>
                                        ${ (classe.disciplinas.length > 0)
                                            ? 
                                            `  
                                            <div class="col-12">
                                            <h6 class="card-title" style="font-size: 0.9rem; font-weight: bold;">Disciplinas</h6>
                                            <div class="col-12">
                                                <ul class="list-group">
                                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                                    <span class="col-5" style="font-weight: bold;">Disciplina</span>
                                                    <span class="col-3"  style="font-weight: bold;">Abreviação</span>
                                                    <span class="col-3"  style="font-weight: bold;">Professor</span>
                                                    <span class="col-1"  style="font-weight: bold;">Professor</span>
                                                    </li>
                                                    
                                                    ${ classe.disciplinas.forEach(disciplina => {
                                                        `
                                                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                                                <span class="col-6">${disciplina.nome_disciplina}</span>
                                                                <span class="col-5" >${disciplina.abreviacao}</span>
                                                                <span class="col-5" >
                                                                ${
                                                                    disciplina.professores.forEach(professor => {
                                                                        `${professor.nome} ${professor.sobrenome} `
                                                                    })
                                                                }
                                                                </span>
                                                                ${ 
                                                                    (funcionario.cargo.toLowerCase() == 'diretor') 
                                                                    ?  `<span class="col-1"><a href="/admin/cursos/disciplinas/${disciplina.id}/deletar" title="Deletar disciplina" class="bi bi-trash-fill" style="color: rgb(214, 58, 58);"></a></span>` 
                                                                    : ''
                                                                }
                                                                
                                                                
                                                            </li>
                                                        `
                                                    }) } 
                                                </ul>
                                            </div>
                                            `
                                            : '' 
                                        }
                                        
                                    </div>
                                    
                                        ${ (classe.turmas.length > 0) 
                                            ? 
                                                `
                                                <div class="col-12">
                                                <h6 class="card-title" style="font-size: 0.9rem; font-weight: bold;">Turmas</h6>
                                                <div class="col-12">
                                                    <ul class="list-group">
                                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                                        <span class="col-4" style="font-weight: bold;">Turma</span>
                                                        <span class="col-4"  style="font-weight: bold;">Turno</span>
                                                        <span class="col-4"  style="font-weight: bold;">Alunos</span>
                                                        </li>
                                                        
                                                        ${ classe.turmas.forEach(turma => {
                                                           `
                                                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                                                <span class="col-4">${turma.codigo_turma}</span>
                                                                <span class="col-4" >${(turma.turno == 'm') ? 'Manhã' : 'Tarde'}</span>
                                                                <span class="col-2"><span class="badge bg-primary rounded-pill">14</span></span>
                                                                ${ 
                                                                    (funcionario.cargo.toLowerCase() == 'diretor') 
                                                                    ?  `<span class="col-2"><a href="/admin/turmas/${turma.id}/deletar" title="Deletar Turma" class="bi bi-trash-fill" style="color: rgb(214, 58, 58);"></a></span>` 
                                                                    : ''
                                                                }
                                                                
                                                            </li> 
                                                           `
                                                        }) } 
                                                    </ul>
                                                </div>
                                                `
                                            : '' 
                                        }
                                        
                                    </div>
                                    

                                    <div class="col-12 mt-4">
                                            ${ 
                                                (funcionario.cargo.toLowerCase() == 'diretor') 
                                                ?  `<a href="/admin/cursos/classe/${classe.id}/deletar" class="btn btn-danger">Deletar Classe</a>` 
                                                : ''
                                            }
                                        
                                    </div>
                                    </div>
                                </div>
                                </div>

                                `
                            }) }
                            </div><!-- End Accordion without outline borders -->
            
                        </div>

                        </div>
                        <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        </div>
                    </div>
                    </div>
                </div>
         `;
                        

          //console.log(curso)
          this.tbody.innerHTML = this.element;
          this.showFormEditCurso();
    }

    showFormEditCurso () {

        const aEdits = document.querySelectorAll('.edit_btn');
        const formEdit = document.getElementById('form-edit-curso');

        aEdits.forEach((aEdit, index) => {
            aEdit.addEventListener('click', async event => {
              event.preventDefault();
              let curso_id = aEdit.children[0].innerHTML;
              
              await fetch(`/admin/cursos/classe/pegar-dados/${ curso_id }`).then(response => {
                    response.json().then(data => {
                      formEdit.innerHTML = `
                              <div class="modal-body row g-3">
                              <div class="col-md-12">
                                <div  class="row col-md-12 p-3">
                                                            
                                  <div align="center" class="row mb-3 student__photo">
                                
                                    <div class="col-md-8 col-lg-12 position-relative">
                                      <img src="/files/${ data.curso.foto }" id="photo${ index }" alt="Capa do Curso...">
                                      <div class="pt-2">
                                        <label for="validationTooltipPhoto" class="btn btn-primary btn-sm" title="Anexe uma foto."><i class="bi bi-upload"></i></label>
                                        <input style="display: none;" type="file" name="foto" class="form-control" id="validationTooltipPhoto">
                                        <input type="hidden" class="form-control" id="validationTooltipPhotoHidden">
                                        <div id="error_msg" class="invalid-tooltip">
                                          É obrigatório ter uma foto.
                                        </div>
                                      </div>
                                    </div>
                                  </div>
    
                                  <div class="col-lg-6 col-md-12 pt-2 mb-2">
                                    <label for="yourName" class="form-label">Nome*</label>
                                    <input type="text" name="nome" class="form-control" value="${ data.curso.nome }" id="yourName" minLength="3" required>
                                    <div class="invalid-feedback">Por favor, o nome do curso.</div>
                                  </div>
                                  
                                  <div class="col-lg-6 col-md-12 pt-2 mb-2">
                                    <label for="sigla" class="form-label">Sigla*</label>
                                    <input type="text" name="codigo_curso" class="form-control" id="sigla" value="${ data.curso.codigo_curso }" required>
                                    <div class="invalid-feedback">Por favor, digite a sigla do curso!</div>
                                  </div>
    
                                  <div class="col-lg-12 col-md-12 pt-2 mb-5">
                                    <label for="descrição" class="form-label">Descrição</label>
                                    <textarea type="text" name="descrição" class="form-control" id="descrição">${ data.curso.descrição }</textarea>
                                    <div class="invalid-feedback">Por favor, digite a descrição do curso!</div>
                                  </div>
                                
                                
                                  ${ (data.curso.classes[0] && data.curso.classes[0])
                                  ?  `<div class="col-lg-6 col-md-12 pt-2">
                                  <label for="classe${ data.curso.classes[0].nivel }" class="form-label">Classe*</label>
                                  <input type="hidden" name="nivel" value="${ data.curso.classes[0].nivel }"/>
                                  <input type="text" class="form-control" id="classe${ data.curso.classes[0].nivel }" value="${ data.curso.classes[0].nivel }ª" disabled required>
                                  
                                </div>
    
                                <div class="col-lg-6 col-md-12 pt-2">
                                  <label for="preco${ data.curso.classes[0].preco }" class="form-label">Preço da Propina*</label>
                                  <input type="text" name="preco" class="form-control" id="preco${ data.curso.classes[0].preco }" value="${ data.curso.classes[0].preco }" required>
                                  <div class="invalid-feedback">Por favor, informe um preço da propina!</div>
                                </div>`
                                  : '' }    
                              
    
    
                                ${ (data.curso.classes[1] && data.curso.classes[1])
                                  ?  `<div class="col-lg-6 col-md-12 pt-2">
                                  <label for="classe${ data.curso.classes[1].nivel }" class="form-label">Classe*</label>
                                  <input type="hidden" name="nivel" value="${ data.curso.classes[1].nivel }"/>
                                  <input type="text" class="form-control" id="classe${ data.curso.classes[1].nivel }" value="${ data.curso.classes[1].nivel }ª" disabled required>
                                  
                                </div>
    
                                <div class="col-lg-6 col-md-12 pt-2">
                                  <label for="preco${ data.curso.classes[1].preco }" class="form-label">Preço da Propina*</label>
                                  <input type="text" name="preco" class="form-control" id="preco${ data.curso.classes[1].preco }" value="${ data.curso.classes[1].preco }" required>
                                  <div class="invalid-feedback">Por favor, informe um preço da propina!</div>
                                </div>`  
                                : '' }
    
                                ${ (data.curso.classes[2] && data.curso.classes[2])
                                  ?  `<div class="col-lg-6 col-md-12 pt-2">
                                  <label for="classe${ data.curso.classes[2].nivel }" class="form-label">Classe*</label>
                                  <input type="hidden" name="nivel" value="${ data.curso.classes[2].nivel }"/>
                                  <input type="text" class="form-control" id="classe${ data.curso.classes[2].nivel }" value="${ data.curso.classes[2].nivel }ª" disabled required>
                                  
                                </div>
    
                                <div class="col-lg-6 col-md-12 pt-2">
                                  <label for="preco${ data.curso.classes[2].preco }" class="form-label">Preço da Propina*</label>
                                  <input type="text" name="preco" class="form-control" id="preco${ data.curso.classes[2].preco }" value="${ data.curso.classes[2].preco }" required>
                                  <div class="invalid-feedback">Por favor, informe um preço da propina!</div>
                                </div>`  
                                : '' }
    
                                ${ (data.curso.classes[3] && data.curso.classes[3])
                                  ?  `<div class="col-lg-6 col-md-12 pt-2">
                                  <label for="classe${ data.curso.classes[3].nivel }" class="form-label">Classe*</label>
                                  <input type="hidden" name="nivel" value="${ data.curso.classes[3].nivel }"/>
                                  <input type="text" class="form-control" id="classe${ data.curso.classes[3].nivel }" value="${ data.curso.classes[3].nivel }ª" disabled required>
                                  
                                </div>
    
                                <div class="col-lg-6 col-md-12 pt-2">
                                  <label for="preco${ data.curso.classes[3].preco }" class="form-label">Preço da Propina*</label>
                                  <input type="text" name="preco" class="form-control" id="preco${ data.curso.classes[3].preco }" value="${ data.curso.classes[3].preco }" required>
                                  <div class="invalid-feedback">Por favor, informe um preço da propina!</div>
                                </div>`  
                                : '' }
    
                              
    
                                
                              </div>
                              </div>
                          </div> 
                          
                          <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Salvar Alterações</button>
                          </div>
                      `;
                        
                      formEdit.action = `/admin/cursos/${ curso_id }/editar`;
    
                      new DevMoonFileReader('validationTooltipPhoto', 'validationTooltipPhotoHidden', `photo${ index }`, 'error_msg');
                    }).catch(error => {
                        console.error(error);
                    })
                }).catch(error => {
                  console.error( error);
                });
            })
          });

    }

    showTurmasData (data) {
        const { turmas, funcionario } = data;
        let pagination = document.querySelector('.pagination');
        pagination.style.display = 'none';

        turmas.forEach(turma => {

            this.element += `
                <tr>
                            <td>
                                <input type="checkbox" class="form-check-input" name="turmas_id" value="${ turma.id }" id="">
                                ${ turma.codigo_turma }
                            </td>
                            <td>
                                ${ turma.ano_lectivo }
                            </td>
                            <td>
                                ${ turma.classe.nivel }ª
                            </td>
                            <td>
                                ${ turma.classe.curso.nome }
                            </td>
                            <td>
                            ${ turma.matriculas.length }
                            </td>
                            <td class="action_links">
                                <a href="/admin/turmas/${ turma.codigo_turma }" data-bs-toggle="modal" data-bs-target=".modal_visualizar_${ turma.codigo_turma }" title="Visualizar turma"><i class="bi bi-eye-fill"></i></a>
                                <a style="color: #2e9b2e" href="#" data-bs-toggle="modal" data-bs-target=".modal_editar" title="Editar curso" class="bi bi-pencil-square edit_btn"><span style="display: none;">${ turma.id }</span></a>
                                ${ 
                                    (funcionario.cargo.toLowerCase() == 'diretor') 
                                    ? `<a href="#" data-bs-toggle="modal" data-bs-target=".modal_deletar_${ turma.id }" title="Deletar curso"><i class="bi bi-trash-fill"></i></a>`

                                    : ''
                                }
                                
                            
                            </td>
                    </tr>

                        <div class="modal fade modal_deletar_${ turma.id }" id="" tabindex="-1" aria-hidden="true" style="display: none;">
                            <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header">
                                <h5 class="modal-title">Tem certeza que quer eliminar esta turma?</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-footer">
                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Não</button>
                                <a href="/admin/turmas/${ turma.id }/deletar"><button type="button" class="btn btn-danger">Sim</button></a>
                                </div>
                            </div>
                            </div>
                        </div><!-- Fim Modal DEletar curso --> 

                        <div class="modal fade modal_visualizar_${ turma.codigo_turma }" id="verticalycentered" tabindex="-1" style="display: none;" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header">
                                <h5 class="modal-title">Informações sobre a turma</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                <div class="tab-pane fade show active profile-overview turmas_view" id="profile-overview">
                                    
                                    <h5 class="card-title">Detalhes da Turma</h5>
                
                                    <div class="row">
                                    <div class="col-lg-3 col-md-4 label ">Curso:</div>
                                    <div class="col-lg-9 col-md-8">${turma.classe.curso.nome} </div>
                                    </div>
                
                                    <div class="row">
                                    <div class="col-lg-3 col-md-4 label">Classe:</div>
                                    <div class="col-lg-9 col-md-8">${turma.classe.nivel}ª</div>
                                    </div>
                
                                    <div class="row">
                                    <div class="col-lg-3 col-md-4 label">Turma:</div>
                                    <div class="col-lg-9 col-md-8">${ turma.codigo_turma }</div>
                                    </div>
                
                                    <div class="row">
                                    <div class="col-lg-3 col-md-4 label">Criado em:</div>
                                    <div class="col-lg-9 col-md-8">${turma.createdAt} </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-lg-12 col-md-12 label">Professores:</div>
                                        <div class="col-lg-12 col-md-12">
                                        <ul type="none" style="margin-left: 5rem;">

                                        ${turma.classe.disciplinas.forEach((disciplina, index) => `
                                            ${disciplina.professores.forEach(professor => `
                                                ${ (professor) 
                                                    ? `<li><i class="bi bi-chevron-right"></i>${professor.nome} ${professor.sobrenome} </li>`
                                                    : '' 
                                                }
                                            `)}
                                        `)}
                                            
                                        </ul>
                                        </div>
                                    </div>
                                </div>
                                </div>
                                <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                                </div>
                            </div>
                            </div>
                    
                
            `;
        });
                
        this.tbody.innerHTML = this.element;
        this.showFormEditTurma();
    }

    showFormEditTurma () {

        const aEdits = document.querySelectorAll('.edit_btn');
        const formEdit = document.getElementById('form-edit-turma');

        aEdits.forEach((aEdit, index) => {
            aEdit.addEventListener('click', async event => {
              event.preventDefault();
              let turma_id = aEdit.children[0].innerHTML;
              
              await fetch(`/admin/turmas/pegar-dados/${ turma_id }`).then(response => {
                    response.json().then(data => {
                      formEdit.innerHTML = `
                        <div class="modal-body row g-3">
                        <div class="col-md-12">
                            <div  class="row col-md-12 p-3">
                                
                            <div class="col-lg-6 col-md-12 pt-2 mb-2">
                                <label for="codigo_turma" class="form-label">Turma*</label>
                                <input type="text" name="codigo_turma" class="form-control" value="${ data.turma.codigo_turma }" id="codigo_turma" minLength="3" required>
                                <div class="invalid-feedback">Por favor, introduza o nome da turma.</div>
                            </div>
                            
                            <div class="col-lg-6 col-md-12 pt-2 mb-2">
                                <label for="ano_lectivo" class="form-label">Ano Lectivo*</label>
                                <input type="number" name="ano_lectivo" class="form-control" id="ano_lectivo" value="${ data.turma.ano_lectivo }" required>
                                <div class="invalid-feedback">Por favor, digite o ano lectivo!</div>
                            </div>
                        </div>
                        </div>
                    </div> 
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Salvar Alterações</button>
                    </div>
                      `;
                        
                      formEdit.action = `/admin/turmas/${ turma_id }/editar`;
    
                      new DevMoonFileReader('validationTooltipPhoto', 'validationTooltipPhotoHidden', 'photo', 'error_msg');
                    }).catch(error => {
                        console.error(error);
                    })
                }).catch(error => {
                  console.error( error);
                });
            })
          });

    }
}