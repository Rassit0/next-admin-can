import { CANApiAdapter } from './CANApi.adapter';
import { ApiError } from './errors/ApiError';

describe('CANApiAdapter - Error Handling Contract', () => {
  let adapter: CANApiAdapter;

  beforeEach(() => {
    adapter = new CANApiAdapter();
  });

  const createMockResponse = (
    status: number,
    body: any,
    contentType = 'application/json',
  ): Response => {
    return {
      status,
      ok: status >= 200 && status < 300,
      statusText: status === 500 ? 'Internal Server Error' : 'Error',
      headers: new Headers({
        'content-type': contentType,
      }),
      json: jest.fn().mockResolvedValue(body),
      text: jest.fn().mockResolvedValue(typeof body === 'string' ? body : JSON.stringify(body)),
    } as unknown as Response;
  };

  it('debe procesar HTTP 500 con formato estandarizado sin filtrar detalles internos ni "Caught by global filter"', async () => {
    const mockRes = createMockResponse(500, {
      statusCode: 500,
      message: 'Internal server error',
    });

    try {
      await (adapter as any).handleResponse(mockRes, '/test-endpoint');
      fail('Debería haber lanzado un ApiError');
    } catch (error: any) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(500);
      expect(error.message).toBe('Internal server error');
      expect(error.message).not.toContain('Caught by global filter');
      expect(error.message).not.toContain('ECONNREFUSED');
      expect(error.message).not.toContain('PostgreSQL');
    }
  });

  it('debe preservar mensajes y estructura de errores de validación y de negocio (HTTP 400)', async () => {
    const mockRes = createMockResponse(400, {
      statusCode: 400,
      message: 'Error en la validación',
      errors: {
        email: ['El correo electrónico ya está registrado'],
      },
    });

    try {
      await (adapter as any).handleResponse(mockRes, '/users');
      fail('Debería haber lanzado un ApiError');
    } catch (error: any) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Error en la validación');
      expect(error.errors).toEqual({
        email: ['El correo electrónico ya está registrado'],
      });
    }
  });

  it('debe preservar mensajes legítimos de recursos no encontrados (HTTP 404)', async () => {
    const mockRes = createMockResponse(404, {
      statusCode: 404,
      message: 'Cuenta financiera no encontrada',
    });

    try {
      await (adapter as any).handleResponse(mockRes, '/financial-accounts/123');
      fail('Debería haber lanzado un ApiError');
    } catch (error: any) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Cuenta financiera no encontrada');
    }
  });

  it('debe utilizar mensaje por defecto si la respuesta HTTP 500 no contiene cuerpo JSON', async () => {
    const mockRes = createMockResponse(500, 'Internal Server Error', 'text/plain');

    try {
      await (adapter as any).handleResponse(mockRes, '/health');
      fail('Debería haber lanzado un ApiError');
    } catch (error: any) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(500);
      expect(error.message).toBe('Error interno del servidor');
    }
  });
});
