import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderProduct } from 'src/orderProduct/entities/orderProduct.entity';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private orderProductsRepository: Repository<OrderProduct>,
    private readonly productsService: ProductsService,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    const order = new Order();

    order.id = createOrderDto.code;
    order.status = createOrderDto.status;
    order.method = createOrderDto.paymentMethod.type;
    order.url = createOrderDto.paymentLink;
    order.cancellationSource = createOrderDto.cancellationSource;
    order.installmentCount = createOrderDto.installmentCount;
    order.grossAmount = createOrderDto.grossAmount;
    order.discountAmount = createOrderDto.discountAmount;
    order.feeAmount = createOrderDto.feeAmount;
    order.netAmount = createOrderDto.netAmount;
    order.extraAmount = createOrderDto.extraAmount;
    order.senderName = createOrderDto.sender.name;
    order.senderEmail = createOrderDto.sender.email;
    order.senderPhone = createOrderDto.sender.phone.number;
    order.senderDocument = createOrderDto.sender.documents.document.value;

    const newOrder = await this.ordersRepository.save(order);

    const items = Array.isArray(createOrderDto.items.item)
      ? createOrderDto.items.item
      : [createOrderDto.items.item];

    await Promise.all(
      items.map(async (item) => {
        const orderProduct = new OrderProduct();

        const product = await this.productsService.findOne(item.id);

        orderProduct.order = newOrder;
        orderProduct.product = product;
        orderProduct.description = item.description;
        orderProduct.quantity = item.quantity;
        orderProduct.amount = item.amount;

        return this.orderProductsRepository.save(orderProduct);
      }),
    );

    return newOrder;
  }

  findAll() {
    return `This action returns all orders`;
  }

  async findOne(id: string) {
    const order = await this.ordersRepository.findOne({
      where: { id },
    });

    if (!order) {
      throw new Error('Pedido não encontrado');
    }

    return order;
  }

  async updateStatus(updateOrderDto: UpdateOrderDto) {
    const order = await this.ordersRepository.findOne({
      where: { id: updateOrderDto.code },
    });

    if (!order) {
      throw new Error('Pedido não encontrado');
    }

    order.status = updateOrderDto.status;

    return this.ordersRepository.save(order);
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
