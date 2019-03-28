import xlsx from 'xlsx';

interface Excel {
    options: any
    workbook: any
}

class Excel {
    constructor(type: "base64" | "binary" | "string" | "buffer" | "array" | "file" = "base64") {
        this.options = { bookType: 'xlsx', bookSST: false, type };
        this.workbook = { SheetNames: [], Sheets: {}, Props: {} };
    }

    public getData() {
        return xlsx.write(this.workbook, this.options);
    }

    public createSheet(name, data, type = "ARRAY") {
        let sheet;
        switch (type) {
            case "JSON":
                sheet = xlsx.utils.json_to_sheet(data);
                break;
            case "TABLE":
                sheet = xlsx.utils.table_to_sheet(data);
                break;
            case "ARRAY":
            default:
                sheet = xlsx.utils.aoa_to_sheet(data);
                break;
        }

        this.workbook.SheetNames.push(name);
        this.workbook.Sheets[name] = sheet;

        return true;
    }
}
export default Excel;