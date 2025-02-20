import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = new DocumentBuilder()
    .setTitle('USB Scan in Docker')
    .setDescription('USB Scan in Docker API description')
    .setVersion('1.0')
    .addTag('usb-scan')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  );

  const port = process.env.PORT || 3000;
  console.log(`Listening on port ${port}`);
  await app.listen(port, '0.0.0.0');
}
bootstrap();
