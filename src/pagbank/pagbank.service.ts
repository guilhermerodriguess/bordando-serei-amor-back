import { Injectable } from '@nestjs/common';

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

  findOne(id: number) {
    return `This action returns a #${id} pagbank`;
  }

  update(id: number) {
    return `This action updates a #${id} pagbank`;
  }

  remove(id: number) {
    return `This action removes a #${id} pagbank`;
  }
}
