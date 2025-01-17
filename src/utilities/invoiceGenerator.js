const fs = require('fs');
const _PDFKIT = require('pdfkit');

class InvoiceGenerator {
    constructor(invoice) {
        this.invoice = invoice;
    }
    static totalAmount = 0;
    async generate() {
        let pdfkit = new _PDFKIT();
        let pdfOutputFile = `./Invoice-${this.invoice.id}.pdf`;
        pdfkit.pipe(fs.createWriteStream(pdfOutputFile));
        await this.writeContent(pdfkit);
        pdfkit.end();
    }

    async writeContent(pdfkit) {
        this.generateHeaders(pdfkit);
        this.generateTable(pdfkit);
        this.generateFooter(pdfkit);
    }

    generateHeaders(pdfkit) {
        let billingAddress = this.invoice.addresses.billing;

        pdfkit
            .image('./LightCareAuto.jpg', 25, 25, { width: 150 })
            .fillColor('#000')
            .fontSize(20)
            .text('INVOICE', 400, 25, { align: 'right' })
            .fontSize(10)
            .text(`Invoice Number: ${this.invoice.id}`, { align: 'right' })
            .text(`Due Date: ${this.invoice.dueDate}`, { align: 'right' });
        //  [COMMENT] A blank line between Balance Due and Billing Address.
        pdfkit.moveDown();
        pdfkit
            .text(`Billing Address:\n${this.invoice.billingAddress.name}`, { align: 'right' })
            .text(`${this.invoice.billingAddress.address}\n${this.invoice.billingAddress.city}`, {
                align: 'right',
            })
            .text(
                `${this.invoice.billingAddress.state} ${this.invoice.billingAddress.postalCode}`,
                { align: 'right' }
            );
        const _kPAGE_BEGIN = 25;
        const _kPAGE_END = 580;
        //  [COMMENT] Draw a horizontal line.
        pdfkit.moveTo(_kPAGE_BEGIN, 200).lineTo(_kPAGE_END, 200).stroke();
        pdfkit
            .text(`Total (${this.invoice.items.length})`)
            .text(`${InvoiceGenerator.totalAmount}`, { align: 'right' });
        pdfkit.text(`Memo: Service delivery is on ${this.invoice.dueDate} `, 50, 210);
        pdfkit.moveTo(_kPAGE_BEGIN, 250).lineTo(_kPAGE_END, 250).stroke();
    }
    generateTable(pdfkit) {
        const _kTABLE_TOP_Y = 270;
        const _kITEM_CODE_X = 50;
        const _kDESCRIPTION_X = 100;
        const _kQUANTITY_X = 250;
        const _kPRICE_X = 300;
        const _kAMOUNT_X = 350;
        pdfkit
            .fontSize(10)
            .text('Item No.', _kITEM_CODE_X, _kTABLE_TOP_Y, { bold: true, underline: true })
            .text('Unit', _kQUANTITY_X, _kTABLE_TOP_Y, { bold: true, underline: true })
            .text('Rate', _kPRICE_X, _kTABLE_TOP_Y, { bold: true, underline: true })
            .text('Amount', _kAMOUNT_X, _kTABLE_TOP_Y, { bold: true, underline: true });
        let items = this.invoice.items;
        for (let idx = 0; idx < items.length; idx++) {
            let item = items[idx];
            let yCoord = _kTABLE_TOP_Y + 25 + idx * 25;
            pdfkit
                .fontSize(10)
                .text(`${idx + 1}`, _kITEM_CODE_X, yCoord)
                .text(`${item.unit}`, _kQUANTITY_X, yCoord)
                .text(`\u20A6${item.rate}`, _kPRICE_X, yCoord)
                .text(`\u20A6${item.rate * item.unit}`, _kAMOUNT_X, yCoord);
            InvoiceGenerator.totalAmount += item.rate * item.unit;
        }
    }
    generateFooter(pdfkit) {
        pdfkit
            .fontSize(10)
            .fillColor('black')
            .text('We care about your safety', 50, 700, { align: 'center' });
    }
}

module.exports = InvoiceGenerator;
