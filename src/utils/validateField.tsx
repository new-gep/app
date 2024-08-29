// src/utils/validation.ts

export type FormValues = {
    name?: string;
    email?: string;
    cpf?: string;
    phone?: string;
    password?: string;
    repeatPassword?: string;
    terms?: boolean;
    checkCode?:string
};


export const validateForm = async (formValues: FormValues) => {
    const errors: Record<string, string> = {};

    if (formValues.name === undefined || formValues.name.trim() === '') {
        errors.name = 'Nome é obrigatório.';
    }

    if (formValues.cpf === undefined || formValues.cpf.trim() === '') {
        errors.cpf = 'CPF é obrigatório.';
    } else {
        const isValidCPF = await validateCPF(formValues.cpf);
        if (!isValidCPF) {
            errors.cpf = 'CPF inválido.';
        }
    }

    if (formValues.phone === undefined || formValues.phone.trim() === '') {
        errors.phone = 'Celular é obrigatório.';
    } else if (formValues.phone.replace(/\D/g, '').length !== 11) {
        errors.phone = 'Celular inválido.';
    }
    

    if (formValues.email === undefined || !/\S+@\S+\.\S+/.test(formValues.email)) {
        errors.email = 'Email inválido.';
    }

    if (formValues.password === undefined || formValues.password.length < 6) {
        errors.password = 'A senha deve ser maior que 6 caracteres.';
    }

    if (formValues.password !== formValues.repeatPassword) {
        errors.repeatPassword = 'As senhas devem ser iguais.';
    }

    if (!formValues.terms) {
        errors.terms = 'É obrigatório aceitar os termos';
    }

    return errors;
};

async function validateCPF(cpf: string): Promise<boolean> {
    cpf = cpf.replace(/[^\d]/g, ''); 
    

    if (cpf.length !== 11) {
        return false;
    }
    

    if (/^(\d)\1+$/.test(cpf)) {
        return false;
    }
    

    let sum = 0;
    let remainder: number;
    
    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    
    remainder = (sum * 10) % 11;
    
    if (remainder === 10 || remainder === 11) {
        remainder = 0;
    }
    
    if (remainder !== parseInt(cpf.substring(9, 10))) {
        return false;
    }
    
    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    
    remainder = (sum * 10) % 11;
    
    if (remainder === 10 || remainder === 11) {
        remainder = 0;
    }
    
    if (remainder !== parseInt(cpf.substring(10, 11))) {
        return false;
    }

    return true;
}
