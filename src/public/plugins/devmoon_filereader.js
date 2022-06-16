class DevMoonFileReader {

    constructor(inputEl, inputHidden, imgEl, divError){

        this.inputEl = document.getElementById(inputEl);
        this.inputHidden = document.getElementById(inputHidden);
        this.imgEl = document.getElementById(imgEl);
        this.divEl = document.getElementById(divError);


        
        if (this.inputEl && this.inputHidden && this.imgEl) {
            this.inputEl.addEventListener('change', e=> {
                
            let reader = new FileReader();

            reader.onload = e => {

                this.divEl.style.display = 'none'
                this.imgEl.src = reader.result;
                this.inputHidden.value = reader.result;

            }

            if (!this.inputEl.files.length) {
                window.alert('Nenhum arquivo foi selecionado.');
                return false;
            }

            let file = this.inputEl.files[0];

            if (['image/jpeg', 'image/gif', 'image/png', 'image/svg+xml'].indexOf(file.type) === -1) {
                this.divEl.style.display = 'block'
                this.divEl.innerHTML = 'Apenas arquivos de imagem são permitidos.';
                this.inputEl.value = ''
                this.imgEl.src = "/assets/img/undraw_male_avatar_323b.svg";

                return false;
            }

            if (file.size > 5000000) {
                this.divEl.style.display = 'block'
                this.divEl.innerHTML = 'O limite para o tamanho da imagem é de 5MB.';
                this.inputEl.value = '';
                this.imgEl.src = "/assets/img/undraw_male_avatar_323b.svg";
                return false;
            }
            console.log()

            reader.readAsDataURL(file);

        });
        } 

    }

}