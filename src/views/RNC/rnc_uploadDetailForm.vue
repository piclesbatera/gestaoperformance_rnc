<template>
    <div class="container-fluid">
        <div class="row" v-if="permissionAlterComponent">
            <div class="col-md-12">
                <div class="float-right">
                    <v-btn @click="newRow();" class="btn btn-primary form-control" color="blue" dark >
                        <v-icon dark left>
                            mdi-plus
                        </v-icon>
                        Novo
                    </v-btn>
                </div>
            </div>
        </div>
        <v-divider></v-divider>
        <div v-for="(object, index) in listObject" :key="index">
            <div class="row">
                <div class="col-lg-12">
                    <h6 v-if="object.file">{{object.file.name}}</h6>
                </div>
            </div>
            <div class="row">
                <b-input-group size="sm" class="m-2">
                    <b-input-group-prepend is-text>
                        <v-icon @click="deleteRow(object);" :disabled="!permissionAlterComponent || (permissionAlterComponent && object.id) || object.loadingFile" title="Remover">mdi-delete</v-icon>
                    </b-input-group-prepend>
                    <b-input-group-prepend is-text>
                        <v-file-input
                            v-if="!object.loadingFile"
                            @change="uploadTempFile(object)"
                            hide-input
                            :disabled="!permissionAlterComponent"
                            v-model="object.file"
                            :success="object.file != null"
                        ></v-file-input>
                        <v-progress-circular :size="24" v-else indeterminate color="primary" ></v-progress-circular>
                    </b-input-group-prepend>
                    <b-input-group-prepend is-text>
                        <v-icon :disabled="!object.file" title="Download" @click="downloadFile(object);">mdi-download</v-icon>
                    </b-input-group-prepend>
                    <b-form-input v-model="object.descricaoAnexo" :disabled="!permissionAlterComponent" placeholder="descrição" style="height: 100%;"></b-form-input>
                </b-input-group>
            </div>
        </div>
    </div>                              
</template>

<script>
import { baseApi, showError } from "@/global";
import axios from "axios";
export default {
    name: "rnc_uploadDetailForm",
    components: {

    },
    props: {
        value: {
            type: Array,
            default: () => []
        },
        permissionAlterComponent: {
            type: Boolean,
            default: true
        },
        newObjectString: {
            type: String,
            default: '{ "id": null,  "descricaoAnexo": "", "file": null, "filename": null, "loadingFile": false }'
        },
        folder: String,
        id: String,
        initialRow: Boolean
    },
    computed: {
        listObject: {
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
        uploadTempFile(object){
            let formData = new FormData();
            formData.append('file', object.file);

            if(!this.filesValidation(object)){
                return false;
            }

            var queryString = (this.id != null && this.id != undefined) ? `?id=${this.id}` : "";

            var url = `${baseApi}/upload/temp/${this.folder}${queryString}`;

            object.loadingFile = true;

            axios.post(url, formData, { headers: {'Content-Type': 'multipart/form-data'} }).then(res => {
                res;
                object.filename = object.file.name;
                object.loadingFile = false;
            }).catch(error => {
                object.filename = null;
                object.file = null;
                object.loadingFile = false;
                showError(error);
            });
            
        },
        filesValidation(object){
            var contains = false;
            var highSize = false;
            this.listObject.forEach( 
                (item) => 
                {
                    if(item.file && item != object){
                        if(object.file.name == item.file.name){
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
                    object.filename = null;
                    object.file = null;
                    showError('O nome do arquivo já está sendo utilizado.');
                }
                if(highSize){
                    object.filename = null;
                    object.file = null;
                    showError('O arquivo não pode ser maior do que 15MB');
                }
                return false;
            }

            return true;
        },
        downloadFile(object){
            var file = object.file;

            const url = window.URL.createObjectURL(file);
            var a = document.createElement("a");
            a.href = url;
            a.download = file.name;
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        },
        newRow(){
            if(this.permissionAlterComponent){
                if(!this.listObject){
                    this.listObject = [];
                }

                var object = (this.newObjectString) ? JSON.parse(this.newObjectString) : {};

                var componentListObject = this.listObject;
                componentListObject.push(object);

                this.listObject = componentListObject;
            }
            
        },
        deleteRow(object){
            const index = this.listObject.indexOf(object);
            this.listObject.splice(index, 1);
        },
        initRow(){
            if(this.initialRow && (!(Array.isArray(this.listObject) && this.listObject.length))){
                this.newRow();
            }
        }
  },
  created: function(){
      this.initRow();
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