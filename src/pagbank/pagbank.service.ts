import { Injectable } from '@nestjs/common';
import { CheckoutDto } from './dto/checkout.body';
import { parseString } from 'xml2js';
import { NotificationBodyDto } from './dto/notification.body';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class PagbankService {
  constructor(private readonly ordersService: OrdersService) {}
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

    if (!body.senderHash) {
      throw new Error('Hash do comprador é obrigatório');
    }

    const bodyCreditCard =
      body.method === 'CREDIT_CARD'
        ? {
            creditCardToken: body.creditCardToken,
            installmentQuantity: String(body.installment?.quantity),
            installmentValue: String(
              body.installment?.installmentAmount.toFixed(2),
            ),
            noInterestInstallmentQuantity: '2',
            creditCardHolderName: body.holder?.name,
            creditCardHolderCPF: cleanDocument(body.holder.document),
            creditCardHolderBirthDate: body.holder.birthDate,
            creditCardHolderAreaCode: cleanPhone(body.holder.phone).areaCode,
            creditCardHolderPhone: cleanPhone(body.holder.phone).number,
          }
        : {};

    const bodyReq = new URLSearchParams({
      mode: 'default',
      paymentMethod: transformMethod(body.method),
      currency: 'BRL',
      senderHash: body.senderHash,
      senderName: body.name,
      senderEmail: body.email,
      senderAreaCode: cleanPhone(body.phone).areaCode,
      senderPhone: cleanPhone(body.phone).number,
      senderCPF: cleanDocument(body.document),
      ...bodyCreditCard,
      ...itemsProperties,
      billingAddressStreet: 'CSB 9 LOTE 3',
      billingAddressNumber: '3',
      billingAddressDistrict: 'Taguatinga Sul',
      billingAddressCity: 'Brasília',
      billingAddressState: 'DF',
      billingAddressCountry: 'BRA',
      billingAddressPostalCode: '72015-961',
      billingAddressComplement: 'AP 611',
      shippingAddressRequired: 'false',
      notificationURL: `${process.env.API_URL}/pagbank/notification`,
    });

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

    if (!response) {
      throw new Error(`Erro ao chamar API PagBank: ${response}`);
    }
    const responseText = await response.text();
    const responseObject = this.parsePagBankResponse(responseText);
    if (responseObject.error) {
      throw new Error(
        `Erro ao chamar API PagBank: ${responseObject.error[0].message}`,
      );
    }

    const order = await this.ordersService.create(responseObject);

    return order;
  }

  private parsePagBankResponse = (xmlString) => {
    let result = null;

    parseString(
      xmlString,
      { trim: true, explicitArray: false },
      (err, data) => {
        if (err) {
          // Tratar erro aqui, se necessário
          console.error('err', err);
          return;
        }
        result = data.transaction || data.errors;
      },
    );

    return result;
  };

  async notification(body: NotificationBodyDto) {
    const PB_API_URL = process.env.PB_API_URL;
    const PB_EMAIL = process.env.PB_EMAIL;
    const PB_ACCESS_TOKEN = process.env.PB_ACCESS_TOKEN;

    const response = await fetch(
      `${PB_API_URL}/transactions/notifications/${body.notificationCode}?email=${PB_EMAIL}&token=${PB_ACCESS_TOKEN}`,
      {
        method: 'GET',
      },
    );

    const xmlString = await response.text();
    const responseObject = this.parsePagBankResponse(xmlString);

    if (responseObject.error) {
      throw new Error(
        `Erro ao chamar API PagBank: ${responseObject.error[0].message}`,
      );
    }

    const updateStatusOrder =
      await this.ordersService.updateStatus(responseObject);

    if (!updateStatusOrder) {
      throw new Error('Erro ao atualizar status do pedido');
    }

    return updateStatusOrder;
  }
}
