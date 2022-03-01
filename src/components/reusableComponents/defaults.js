const defaults = {
  hours: [
    { id: 0, name: "00" },
    { id: 1, name: "01" },
    { id: 2, name: "02" },
    { id: 3, name: "03" },
    { id: 4, name: "04" },
    { id: 5, name: "05" },
    { id: 6, name: "06" },
    { id: 7, name: "07" },
    { id: 8, name: "08" },
    { id: 9, name: "09" },
    { id: 10, name: "10" },
    { id: 11, name: "11" },
    { id: 12, name: "12" },
    { id: 13, name: "13" },
    { id: 14, name: "14" },
    { id: 15, name: "15" },
    { id: 16, name: "16" },
    { id: 17, name: "17" },
    { id: 18, name: "18" },
    { id: 19, name: "19" },
    { id: 20, name: "20" },
    { id: 21, name: "21" },
    { id: 22, name: "22" },
    { id: 23, name: "23" },
  ],
  hours2: [
    { id: 1, name: "00" },
    { id: 2, name: "01" },
    { id: 3, name: "02" },
    { id: 4, name: "03" },
    { id: 5, name: "04" },
    { id: 6, name: "05" },
    { id: 7, name: "06" },
    { id: 8, name: "07" },
    { id: 9, name: "08" },
    { id: 10, name: "09" },
    { id: 11, name: "10" },
    { id: 12, name: "11" },
    { id: 13, name: "12" },
    { id: 14, name: "13" },
    { id: 15, name: "14" },
    { id: 16, name: "15" },
    { id: 17, name: "16" },
    { id: 18, name: "17" },
    { id: 19, name: "18" },
    { id: 20, name: "19" },
    { id: 21, name: "20" },
    { id: 22, name: "21" },
    { id: 23, name: "22" },
    { id: 24, name: "23" },
  ],
  minutes: [
    { id: 0, name: "00" },
    { id: 15, name: "15" },
    { id: 30, name: "30" },
    { id: 45, name: "45" },
  ],

  minutes2: [
    { id: 1, name: "00" },
    { id: 15, name: "15" },
    { id: 30, name: "30" },
    { id: 45, name: "45" },
  ],

  authorizacion_status: ["pending", "aproved", "rejected"],

  fullExpedientState: [
    { id: 1, name: "Inicial" },
    { id: 2, name: "Sin Taller" },
    { id: 3, name: "Sin presupuesto" },
    { id: 4, name: "Pendiente Solicitar Autorización" },
    { id: 5, name: "Pendiente Autorizar Taller" },
    { id: 6, name: "Autorizado Taller" },
    { id: 7, name: "Finalizado" },
    { id: 8, name: "Cerrado" },
    { id: 9, name: "Rechazado" },
  ],

  expedientWarranty: [
    { id: 1, name: "Garantía" },
    { id: 2, name: "Fuera Garantía" },
    { id: 3, name: "N.A." },
  ],

  trueFalseList: [
    { id: 1, name: "Si" },
    { id: 2, name: "No" },
  ],

  assessmentItems: [
    { id: 1, name: "1" },
    { id: 2, name: "2" },
    { id: 3, name: "3" },
  ],

  fullExpedientCustomerAuthState: [
    { id: 1, name: "Pendiente" },
    { id: 2, name: "Aprobada" },
    { id: 3, name: "Rechazada" },
  ],

  expedientNoticeKind: [
    { id: 1, name: "Aviso" },
    { id: 2, name: "Planning" },
    { id: 3, name: "Otros" },
  ],

  workshopKinds: [
    { id: 1, name: "Chapa - Pintura" },
    { id: 2, name: "Mantenimiento" },
    { id: 3, name: "Mecánica General" },
    { id: 4, name: "Lunas" },
    { id: 5, name: "Neumáticos" },
    { id: 6, name: "Lavado" },
    { id: 7, name: "Grúa" },
    { id: 8, name: "Plataforma" },
  ],

  periodo: [
    { id: 1, name: "Única" },
    { id: 2, name: "Mensual" },
    { id: 3, name: "Anual" },
  ],

  invoiceDay: [
    { id: 1, name: "Último día mes" },
    { id: 2, name: "Primer día laborable" },
    { id: 3, name: "Día exacto" },
  ],

  invoiceType: [
    { id: "IN", name: "Individual" },
    { id: "CO", name: "Colectiva" },
  ],

  agrupationType: [
    { id: 1, name: "Flota" },
    { id: 2, name: "Zona" },
    { id: 3, name: "Subzona" },
  ],

  jobMethod: [
    { id: 1, name: "export" },
    { id: 2, name: "import" },
  ],

  idioma: [
    { id: "es", name: "spanish" },
    { id: "en", name: "english" },
    { id: "pt", name: "portuguese" },
  ],

  netTotal: (quantity, price, discount) =>
    (quantity * price * (100 - discount)) / 100,

  formatDateLocal: (value) => {
    if (value && value.includes("T")) {
      const arrayDate = value.split("T");
      const reverseString = arrayDate[0].split("-");
      let fecha = `${reverseString[2]}/${reverseString[1]}/${reverseString[0]}`;
      return fecha;
    } else {
      if (value && !value.includes("T")) {
        let fecha = value;
        if (value !== "") {
          const dt = value.split("-");
          fecha = `${dt[2]}/${dt[1]}/${dt[0]}`;
        }
        return fecha;
      }
    }
    return "-";
  },

  replaceSpacesErrorMessage: (message) => {
    const doubleSpaces = message.replace(/  +/g, "-");
    const removeSpaces = doubleSpaces.replace(/ +/g, "");
    const replaceSpaces = removeSpaces.replace(/-+/g, " ");
    return replaceSpaces;
  },

  formatNumberDecimalsCommaMiles: (num) => {
    let value = Number.parseFloat(num).toFixed(2).replace(".", ",");
    value.toString();

    if (value.length > 5) {
      return value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    } else {
      return value;
    }
  },

  capitalizeFirstLetter: (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  formatDate: (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  },

  formatDateUS: (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  },
};

export default defaults;
