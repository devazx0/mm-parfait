import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Orders (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /orders', () => {
    const validPayload = {
      customerName: 'Ada Lovelace',
      customerEmail: 'ada@example.com',
      customerPhone: '+2348012345678',
      deliveryAddress: '12 Admiralty Way, Lekki, Lagos',
      deliveryMethod: 'standard',
      items: [
        { name: 'Classic Berry Parfait', price: '₦6,500', priceNum: 6500, quantity: 2 },
      ],
    };

    it('creates an order and returns the persisted record', async () => {
      const response = await request(app.getHttpServer())
        .post('/orders')
        .send(validPayload)
        .expect(201);

      expect(response.body).toMatchObject({
        customerName: 'Ada Lovelace',
        deliveryMethod: 'standard',
        status: 'Pending',
        statusStyle: expect.any(String),
      });
      expect(response.body.orderNumber).toMatch(/^MMP-\d{8}-\d{4}$/);
      expect(response.body.totalAmount).toBe(13000);
      expect(response.body.items).toHaveLength(1);
    });

    it('applies free delivery above the threshold', async () => {
      const response = await request(app.getHttpServer())
        .post('/orders')
        .send({
          ...validPayload,
          items: [{ name: 'Catering Pack', price: '₦6,000', priceNum: 6000, quantity: 1 }],
        })
        .expect(201);

      expect(response.body.deliveryFee).toBe(0);
      expect(response.body.totalAmount).toBe(6000);
    });

    it('rejects an empty items array', async () => {
      await request(app.getHttpServer())
        .post('/orders')
        .send({ ...validPayload, items: [] })
        .expect(400);
    });

    it('rejects an invalid delivery method', async () => {
      await request(app.getHttpServer())
        .post('/orders')
        .send({ ...validPayload, deliveryMethod: 'teleport' })
        .expect(400);
    });
  });
});
