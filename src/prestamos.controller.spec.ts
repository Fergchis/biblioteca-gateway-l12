import { UnauthorizedException } from '@nestjs/common';
import { PrestamosController } from './prestamos.controller';

describe('PrestamosController', () => {
  const controller = new PrestamosController();
  const original = global.fetch;

  afterEach(() => {
    global.fetch = original;
  });

  it('sin header Authorization responde 401 y no llama a nadie', async () => {
    const espia = jest.fn();
    global.fetch = espia;

    await expect(controller.listar()).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(espia).not.toHaveBeenCalled();
  });

  // Desde L3 el gateway valida el token contra Cognito: un texto cualquiera ya no pasa, y el
  // microservicio (3002) no se entera de que alguien lo intentó.
  it('con un token que no es un JWT responde 401 y no llama al 3002', async () => {
    const espia = jest.fn();
    global.fetch = espia;

    await expect(
      controller.listar('Bearer holaquetal'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(espia).not.toHaveBeenCalled();
  });
});
