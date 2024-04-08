import axios, { AxiosInstance } from 'axios';

export class AxiosService {
    private readonly axiosInstance: AxiosInstance;
    private readonly username: string;
    private readonly baseUrl: string;
    private readonly apiUrl: string;

    constructor() {
        this.axiosInstance = axios.create();
        this.setupInterceptors();
        this.username = process.env.ADAFRUIT_IO_USERNAME;
        this.baseUrl = 'https://io.adafruit.com';
        this.apiUrl = `${this.baseUrl}/api/v2/${this.username}`;
    }

    private setupInterceptors() {
        this.axiosInstance.interceptors.request.use((config) => {
            config.headers['X-AIO-Key'] = process.env.ADAFRUIT_IO_KEY;
            return config;
        });
    }

    public async axiosRequest(method: string, path: string, data?: any): Promise<any> {
        try {
            const url = `${this.apiUrl}/${path}`;
            const response = await this.axiosInstance.request({ method, url, data });
            return response.data;
        } catch (err) {
            console.error('Error:', err);
            throw err;
        }
    }
}
