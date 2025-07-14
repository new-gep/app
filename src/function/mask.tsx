type MaskType =
  | "phone"
  | "amount"
  | "cpf"
  | "firstName"
  | "secondName"
  | "day"
  | "month"
  | "year"
  | "remove"
  | "amountHidden"
  | "km"
  | "dateFormat"
  | "hiddenPhone"
  | "hiddenEmail"
  | "emailBreakLine"
  | "fullName"
  | "cep"
  | "formatMonthYear"
  | "dateFormatBrazil"
  | "age";

export default function Mask(type: MaskType, value: string | number): string {
  switch (type) {
    case "phone": {
      const cleanedValue = value.toString().replace(/\D/g, "");
      let maskedValue = "";
      if (cleanedValue.length < 11) {
        maskedValue = cleanedValue.replace(
          /(\d{2})(\d{4})(\d{4})/,
          "($1) $2-$3"
        );
      } else {
        maskedValue = cleanedValue.replace(
          /(\d{2})(\d{5})(\d{4})/,
          "($1) $2-$3"
        );
      }
      return maskedValue;
    }
    case "amount": {
      const stringValue = value?.toString().trim();

      // Se for null, undefined ou string vazia, retorna vazio
      if (!stringValue || stringValue === "") return "";

      // Verifica se é uma frase específica como "a combinar"
      const isPhrase = ["a combinar", "por mês", "por projeto"].includes(
        stringValue.toLowerCase()
      );
      if (isPhrase) return stringValue;

      // Verifica se é um número válido (aceita ponto ou vírgula como separador decimal)
      const isNumeric = /^-?\d+(?:[.,]\d+)?$/.test(stringValue);

      if (isNumeric) {
        // Normaliza o valor: substitui vírgula por ponto e remove caracteres inválidos
        const normalizedValue = stringValue
          .replace(/[^0-9.,-]/g, "") // Remove tudo que não for dígito, ponto, vírgula ou sinal
          .replace(/,/, ".") // Substitui a primeira vírgula por ponto
          .replace(/\.+/g, "."); // Garante que só haja um ponto

        const numericValue = Number(normalizedValue);

        if (!isNaN(numericValue)) {
          // Divide por 100 assumindo que o valor está em centavos
          return (numericValue / 100).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          });
        } else {
          console.log("Failed to convert:", stringValue, "to", normalizedValue); // Debug
        }
      }

      // Se não for número válido, retorna o valor original
      return stringValue;
    }
    case "cpf": {
      return value
        .toString()
        .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    case "firstName": {
      return value.toString().split(" ")[0];
    }
    case "secondName": {
      return value.toString().split(" ").slice(1).join(" ");
    }
    case "fullName": {
      const names = value.toString().trim().split(" ");
      const firstName = names[0];
      const lastName = names.length > 1 ? names[names.length - 1] : "";
      return `${firstName} ${lastName}`;
    }
    case "day": {
      return new Date(value.toString()).getDate().toString();
    }
    case "month": {
      return (new Date(value.toString()).getMonth() + 1).toString();
    }
    case "year": {
      return new Date(value.toString()).getFullYear().toString();
    }
    case "remove": {
      return value.toString().replace(/\D/g, "");
    }
    case "amountHidden": {
      const amount = (Number(value) / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
      return amount.replace(/\d/g, "*");
    }
    case "km": {
      const km = parseFloat(value.toString());
      return km.toFixed(2);
    }
    case "dateFormat": {
      if (!value) {
        return "";
      }
      const meses = [
        "janeiro",
        "fevereiro",
        "março",
        "abril",
        "maio",
        "junho",
        "julho",
        "agosto",
        "setembro",
        "outubro",
        "novembro",
        "dezembro",
      ];
      const partes = value.toString().split("T");
      const data = partes[0].split("-");
      const hora = partes[1].split(":");

      const ano = data[0];
      const mesIndex = parseInt(data[1]) - 1;
      const mes = meses[mesIndex];
      const dia = data[2].padStart(2, "0");
      const horas = hora[0].padStart(2, "0");
      const minutos = hora[1].padStart(2, "0");
      const segundos = hora[2];
      const fusoHorario = "UTC";

      const dataFormatada = `dia ${dia} de ${mes} de ${ano}`;
      return dataFormatada;
    }
    case "dateFormatBrazil": {
      if (!value) return "";

      const strValue = value.toString();

      // Se for uma data ISO (contém 'T'), extrai apenas a parte da data
      if (strValue.includes("T")) {
        const isoParts = strValue.split("T")[0].split("-");
        if (isoParts.length === 3) {
          return `${isoParts[2]}/${isoParts[1]}/${isoParts[0]}`;
        }
      }

      // Verifica formato brasileiro ou ISO sem timestamp
      if (strValue.length === 10 && strValue.includes("-")) {
        const parts = strValue.split("-");
        if (parts[0].length === 4) {
          // Formato ISO (YYYY-MM-DD)
          return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return strValue; // Já está no formato DD-MM-YYYY
      }
      return strValue; // Fallback para outros casos
    }
    case "hiddenPhone": {
      const telefoneLimpo = value.toString().replace(/\D/g, "");

      const ddd = telefoneLimpo.slice(0, 2); // (11)
      const firstDigit = telefoneLimpo[2]; // 9
      const hidden = "***"; // ***
      const midVisible = telefoneLimpo.slice(6, 8); // 23
      const endHidden = "**"; // **

      return `(${ddd}) ${firstDigit}${hidden}${midVisible}${endHidden}`;
    }
    case "hiddenEmail": {
      const [usuario, dominio] = value.toString().split("@");
      const usuarioMascarado =
        usuario.length > 4
          ? `${usuario.slice(0, 4)}${"*".repeat(usuario.length - 4)}`
          : usuario;
      return `${usuarioMascarado}@${dominio}`;
    }
    case "emailBreakLine": {
      value = value.toString();
      const [user, domain] = value.split("@");

      // Retorne o e-mail formatado com uma quebra de linha entre o usuário e o domínio
      return `${user}\n@${domain}`;
    }
    case "cep": {
      return value
        .toString()
        .replace(/\D/g, "") // Remove tudo que não é número
        .replace(/^(\d{5})(\d)/, "$1-$2") // Insere o hífen depois dos 5 primeiros números
        .slice(0, 9);
    }
    case "formatMonthYear": {
      const cleaned = value.toString().replace(/\D/g, "");

      // Aplica a máscara MM/YYYY
      if (cleaned.length <= 2) {
        return cleaned;
      } else if (cleaned.length <= 6) {
        return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
      } else {
        return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 6)}`;
      }
    }
    case "age":{
      const birthDate = new Date(value);
      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();
      const hasHadBirthdayThisYear =
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

      if (!hasHadBirthdayThisYear) {
        age -= 1;
      }

      return `${age} anos`;
    }
    default: {
      return value.toString();
    }
  }
}
