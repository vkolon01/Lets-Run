import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment"
import { HttpClient } from "@angular/common/http";

const WEATHER_URL = environment.apixuWeatherApi;

@Injectable({providedIn: "root"})
export class WeatherService {


    constructor(private http: HttpClient) {}

    getWeatherForecast(latitude: string, longitude: string) {
        const queryParams = `q=${latitude},${longitude}&days=7`
        
       return this.http.get<{weather: {current: any, forecast: [any]}}>(WEATHER_URL + queryParams);
    }

}