import { Injectable } from '@nestjs/common';
import { CheckoutDto } from './dto/checkout.body';
import { parseString } from 'xml2js';

@Injectable()
export class PagbankService {
  async createSession() {
    const PB_API_URL = process.env.PB_API_URL;
    const PB_EMAIL = process.env.PB_EMAIL;
    const PB_ACCESS_TOKEN = process.env.PB_ACCESS_TOKEN;

    const response = await fetch(
      `${PB_API_URL}/sessions?email=${PB_EMAIL}&token=${PB_ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'content-length': '0',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Erro ao chamar API PagBank: ${response.statusText}`);
    }

    const xmlString = await response.text();
    const startTag = '<id>';
    const endTag = '</id>';
    const startIndex = xmlString.indexOf(startTag) + startTag.length;
    const endIndex = xmlString.indexOf(endTag);

    // Extraia o valor entre as tags <id>
    const sessionId = xmlString.slice(startIndex, endIndex).toString();

    return sessionId;
  }

  async checkout(body: CheckoutDto) {
    const PB_API_URL = process.env.PB_API_URL;
    const PB_EMAIL = process.env.PB_EMAIL;
    const PB_ACCESS_TOKEN = process.env.PB_ACCESS_TOKEN;

    console.log('body', body);

    const cleanPhone = (phone: string) => {
      const clean = phone.replace(/\D/g, '');
      const areaCode = clean.slice(0, 2);
      const number = clean.slice(2);

      return { areaCode, number };
    };

    const cleanDocument = (document: string) => {
      return document.replace(/\D/g, '');
    };

    const transformMethod = (method: string) => {
      switch (method) {
        case 'CREDIT_CARD':
          return 'creditCard';
        case 'BOLETO':
          return 'boleto';
        case ' ONLINE_DEBIT':
          return 'onlineDebit';
        default:
          throw new Error('Método de pagamento inválido');
      }
    };

    const itemsData = body.items.map((item, index) => ({
      [`itemId${index + 1}`]: item.id,
      [`itemDescription${index + 1}`]: item.name,
      [`itemAmount${index + 1}`]: String(item.price),
      [`itemQuantity${index + 1}`]: String(item.quantity),
    }));

    const itemsProperties = itemsData.reduce((acc, item) => {
      Object.entries(item).forEach(([key, value]) => {
        acc[`${key}`] = value;
      });
      return acc;
    }, {});

    const bodyReq = new URLSearchParams({
      mode: 'default',
      method: transformMethod(body.method),
      currency: 'BRL',
      senderHash: body.senderHash,
      senderName: body.name,
      senderEmail: body.email,
      senderAreaCode: cleanPhone(body.phone).areaCode,
      senderPhone: cleanPhone(body.phone).number,
      senderCPF: cleanDocument(body.document),
      ...itemsProperties,
      creditCardToken: body.creditCardToken,
      installmentQuantity: String(body.installment.quantity),
      installmentValue: String(body.installment.installmentAmount.toFixed(2)),
      noInterestInstallmentQuantity: '2',
      creditCardHolderName: body.holder.name,
      creditCardHolderCPF: cleanDocument(body.holder.document),
      creditCardHolderBirthDate: body.holder.birthDate,
      creditCardHolderAreaCode: cleanPhone(body.holder.phone).areaCode,
      creditCardHolderPhone: cleanPhone(body.holder.phone).number,
      billingAddressStreet: 'CSB 9 LOTE 3',
      billingAddressNumber: '3',
      billingAddressDistrict: 'Taguatinga Sul',
      billingAddressCity: 'Brasília',
      billingAddressState: 'DF',
      billingAddressCountry: 'BRA',
      billingAddressPostalCode: '72015-961',
      billingAddressComplement: 'AP 611',
      shippingAddressRequired: 'false',
    });

    console.log('body', bodyReq);

    const response = await fetch(
      `${PB_API_URL}/transactions?email=${PB_EMAIL}&token=${PB_ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/x-www-form-urlencoded; charset=ISO-8859-1',
        },
        body: bodyReq,
      },
    );
    const responseText = await response.text();
    console.log(responseText);
    const responseObject = this.parsePagBankResponse(responseText);
    console.log(responseObject);
    return responseObject;
  }

  private parsePagBankResponse = (xmlString) => {
    let result = null;

    parseString(
      xmlString,
      { trim: true, explicitArray: false },
      (err, data) => {
        if (err) {
          // Tratar erro aqui, se necessário
          console.error(err);
          return;
        }
        result = data.transaction || data.errors;
      },
    );

    return result;
  };

  async notification(body: any) {
    console.log('notification', body);
  }
}
