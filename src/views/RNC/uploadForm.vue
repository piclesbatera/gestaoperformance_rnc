<template>
    <div class="container-fluid">
        <div class="row" v-if="permissaoAlterarComponente">
            <div class="col-md-12">
                <div class="float-right">
                    <slot name="iconesAdicionais"></slot>
                    <v-btn @click="novaLinha();" class="ml-2 btn btn-primary" color="blue" dark >
                        <v-icon dark left>
                            mdi-plus
                        </v-icon>
                        Novo
                    </v-btn>
                </div>
            </div>
        </div>
        <v-divider></v-divider>
        <div v-for="(object, index) in listaObjeto" :key="index">
            <template v-if="(validaConfirmacao && object[propConfirmacao]) || (!validaConfirmacao)">
                <div class="row">
                    <div class="col-lg-12">
                        <h6 v-if="object.nomeArquivo">{{object.nomeArquivo}}</h6>
                    </div>
                </div>
                <div class="row">
                    <b-input-group size="sm" class="m-2">
                        <b-input-group-prepend is-text>
                            <v-icon @click="deletarLinha(object);" :disabled="!permissaoAlterarComponente || (permissaoAlterarComponente && !object.new) || object.loadingArquivo" title="Remover">mdi-delete</v-icon>
                        </b-input-group-prepend>
                        <b-input-group-prepend is-text>
                            <v-file-input
                                v-if="!object.loadingArquivo"
                                @change="changeObjectArquivo(object)"
                                hide-input
                                :disabled="!permissaoAlterarComponente || (permissaoAlterarComponente && !object.new) || object.loadingArquivo"
                                v-model="object.file"
                                :success="object.file != null"
                            ></v-file-input>
                            <v-progress-circular :size="24" v-else indeterminate color="primary" ></v-progress-circular>
                        </b-input-group-prepend>
                        <b-input-group-prepend is-text>
                            <v-icon :disabled="object.new" v-if="!object.loadingDownloadAnexo" title="Download" @click="downloadArquivo(object);">mdi-download</v-icon>
                            <v-progress-circular v-else indeterminate color="primary" ></v-progress-circular>
                        </b-input-group-prepend>
                        <b-form-input trim v-model="object.descricaoAnexo" :maxLength="descricaoLength" :disabled="!permissaoAlterarComponente || (permissaoAlterarComponente && !object.new) || object.loadingArquivo" placeholder="descrição" style="height: 100%;"></b-form-input>
                        <b-input-group-append is-text v-if="caixaConfirmacao">
                            <v-icon :color="(object[propConfirmacao] || marcaTodasCaixas) ? 'blue' : ''">
                                mdi-check
                            </v-icon>
                        </b-input-group-append>
                    </b-input-group>
                </div>
            </template>
        </div>
    </div>                              
</template>

<script>
import { baseApi, showError } from "@/global";
import axios from "axios";
export default {
    name: "uploadForm",
    components: {

    },
    props: {
        value: {
            type: Array,
            default: () => []
        },
        permissaoAlterarComponente: {
            type: Boolean,
            default: true
        },
        novoObjetoString: {
            type: String,
            default: '{ "id": null,  "descricaoAnexo": "", "file": null, "nomeArquivo": null, "loadingArquivo": false }'
        },
        uploadTemp: {
            type: Boolean,
            default: false
        },
        tipoArquivo: String,
        id: Number,
        inicializaLinha: Boolean,
        descricaoLength: {
            type: String,
            default: "50"
        },
        caixaConfirmacao: {
            type: Boolean,
            default: false
        },
        validaConfirmacao: {
            type: Boolean,
            default: false
        },
        marcaTodasCaixas: {
            type: Boolean,
            default: false
        },
        propConfirmacao: {
            type: String,
            default: "leitura"
        },
    },
    computed: {
        listaObjeto: {
            get () {
                return this.value
            },
            set (value) {
                this.$emit('input', value);
            }
        }
    },
  data: function() {
    return {
    }
  },
  methods: {
        changeObjectArquivo(object){

            if(!this.validacaoArquivos(object)){
                return false;
            }

            object.nomeArquivo = object.file.name;

            if(this.uploadTemp){
                this.uploadTempArquivo(object);
            }

        },
        uploadTempArquivo(object){
            let formData = new FormData();
            formData.append('file', object.file);

            var queryString = (this.id != null && this.id != undefined) ? `?id=${this.id}` : "";

            var url = `${baseApi}/upload/temp/${this.tipoArquivo}${queryString}`;

            object.loadingArquivo = true;

            axios.post(url, formData, { headers: {'Content-Type': 'multipart/form-data'} }).then(res => {
                res;
                object.loadingArquivo = false;
            }).catch(error => {
                object.nomeArquivo = null;
                object.file = null;
                object.loadingArquivo = false;
                showError(error);
            });
            
        },
        validacaoArquivos(object){
            var contains = false;
            var highSize = false;
            
            if(object && object.file){
                this.listaObjeto.forEach( 
                    (item) => 
                    {
                        if(item.nomeArquivo && item != object){
                            if(object.file.name == item.nomeArquivo){
                                contains = true;
                            }
                        }
                    }
                );
                if(object.file.size > 15728640){
                    highSize = true;
                }

                if(contains || highSize){
                    if(contains){
                        object.nomeArquivo = null;
                        object.file = null;
                        showError('O nome do arquivo já está sendo utilizado.');
                    }
                    if(highSize){
                        object.nomeArquivo = null;
                        object.file = null;
                        showError('O arquivo não pode ser maior do que 15MB');
                    }
                    return false;
                }
            } else {
                object.nomeArquivo = null;
                return false;
            }

            return true;
        },
        downloadArquivo(object){
            var nomeArquivo = object.nomeArquivo;
            // var index = this.listaObjeto.indexOf(object);
            var queryString = (this.id != null && this.id != undefined) ? `?id=${this.id}` : "";
            var tipoArquivoAPI = (this.tipoArquivo != null && this.tipoArquivo != undefined) ? `${this.tipoArquivo}/` : "";
            var url = `${baseApi}/download/${tipoArquivoAPI}${nomeArquivo}${queryString}`;

            // this.listaObjeto[index]['loadingDownloadAnexo'] = true;

            axios({ url: url, method: 'GET', responseType: 'blob',}).then((response) => {
                const url = window.URL.createObjectURL(response.data);
                // this.listaObjeto[index].loadingDownloadAnexo = false;

                var a = document.createElement("a");
                a.href = url;
                a.download = nomeArquivo;
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            }).catch(error => {
                // this.listaObjeto[index].loadingDownloadAnexo = false;
                showError(error);
            });

            // axios({ url: url, method: 'GET'}).then(function(response) {
            //     var blob = new Blob([response.data], {
            //           type: response.data.type
            //     });
            //     var url = window.URL.createObjectURL(blob)
            //     window.open(url);
            //   })
            //   .catch(function(error) {
            //         console.log(error)
            // });

        },
        novaLinha(){
            if(this.permissaoAlterarComponente){
                var objeto = (this.novoObjetoString) ? JSON.parse(this.novoObjetoString) : {};
                if(!this.listaObjeto){
                    var listaObjeto = [];
                    listaObjeto.push(objeto);
                    this.listaObjeto = listaObjeto;
                } else {
                    this.listaObjeto.push(objeto);
                }
            }
            
        },
        deletarLinha(object){
            const index = this.listaObjeto.indexOf(object);
            this.listaObjeto.splice(index, 1);
        },
        inicializarLinha(){
            if(this.inicializaLinha && (!(Array.isArray(this.listaObjeto) && this.listaObjeto.length))){
                this.novaLinha();
            }
        }
  },
  created: function(){
      this.inicializarLinha();
  }
}
</script>


<style scoped>

.v-text-field {
    padding-top: 0px;
    margin-top: 0px;
}

.col, .col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12, .col-auto, .col-lg, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg-auto, .col-md, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-md-auto, .col-sm, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm-auto, .col-xl, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12, .col-xl-auto {
    padding: 3px 12px;
}

hr{
    margin-top: 5px;
    margin-bottom: 5px;
}

</style>


<style>
.v-application--is-ltr .v-input__prepend-outer {
    margin: 0px;
}
</style>