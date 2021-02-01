import { extend, setInteractionMode } from 'vee-validate';
import { required, alpha_spaces, min, max, email } from 'vee-validate/dist/rules';
import { showError } from "@/global";
setInteractionMode('eager')

extend('requerido', {
  ...required,
  message: '{_field_} é obrigatório!'
});
extend('alfa_espacos', {
  ...alpha_spaces,
  message: '{_field_} deve conter apenas letras!',
});

extend('minimo', {
  ...min,
  message: '{_field_} não pode ser menor que {length} caracteres!',
});

extend('maximo', {
  ...max,
  message: '{_field_} não pode ser maior que {length} caracteres!',
});

extend('email', {
  ...email,
  message: '{_field_} tem que ser válido!',
});

export function validacaoFormulario(observer){
  observer.validate();
  if(observer.flags.invalid){
    showError("Preencha todos os campos obrigatórios.");
  }
  return observer.flags.valid;
}

export default { validacaoFormulario };
