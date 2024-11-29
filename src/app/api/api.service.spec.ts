import { HttpClient, HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { APIService } from './api.service';
import { firstValueFrom } from 'rxjs';

describe('APIService', () => {
  let service: APIService;
  let httpClientSpy: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [APIService, { provide: HttpClient, useValue: httpClientSpy }],
    });

    service = TestBed.inject(APIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getById', () => {
    it('should call http.get with correct parameters', () => {
      const mockData = { id: 1, name: 'Test' };
      const endpoint = '/api/test';
      const params = new HttpParams().set('key', 'value');

      httpClientSpy.get.mockReturnValue(of(mockData));

      service.getById(endpoint, params).subscribe((data) => {
        expect(data).toEqual(mockData);
      });

      expect(httpClientSpy.get).toHaveBeenCalledWith(
        endpoint,
        expect.objectContaining({ params })
      );
    });

    it('should handle errors', async () => {
      const testError = new Error('Test error');
      httpClientSpy.get.mockReturnValue(throwError(() => testError));

      await expect(
        firstValueFrom(service.getById('/api/test'))
      ).rejects.toEqual(testError);
    });
  });

  describe('post', () => {
    it('should call http.post with correct parameters', () => {
      const mockData = { name: 'Test' };
      const endpoint = '/api/test';

      httpClientSpy.post.mockReturnValue(of(mockData));

      service.post(endpoint, mockData).subscribe((data) => {
        expect(data).toEqual(mockData);
      });

      expect(httpClientSpy.post).toHaveBeenCalledWith(
        endpoint,
        mockData,
        expect.any(Object)
      );
    });
  });

  describe('put', () => {
    it('should call http.put with correct parameters', () => {
      const mockData = { id: 1, name: 'Test' };
      const endpoint = '/api/test/1';

      httpClientSpy.put.mockReturnValue(of(mockData));

      service.put(endpoint, mockData).subscribe((data) => {
        expect(data).toEqual(mockData);
      });

      expect(httpClientSpy.put).toHaveBeenCalledWith(
        endpoint,
        mockData,
        expect.any(Object)
      );
    });
  });

  describe('patch', () => {
    it('should call http.patch with correct parameters', () => {
      const mockData = { name: 'Test' };
      const endpoint = '/api/test/1';

      httpClientSpy.patch.mockReturnValue(of(mockData));

      service.patch(endpoint, mockData).subscribe((data) => {
        expect(data).toEqual(mockData);
      });

      expect(httpClientSpy.patch).toHaveBeenCalledWith(
        endpoint,
        mockData,
        expect.any(Object)
      );
    });
  });

  describe('delete', () => {
    it('should call http.delete with correct parameters', () => {
      const endpoint = '/api/test/1';
      const mockResponse = { success: true };

      httpClientSpy.delete.mockReturnValue(of(mockResponse));

      service.delete(endpoint).subscribe((data) => {
        expect(data).toEqual(mockResponse);
      });

      expect(httpClientSpy.delete).toHaveBeenCalledWith(
        endpoint,
        expect.any(Object)
      );
    });
  });
});
