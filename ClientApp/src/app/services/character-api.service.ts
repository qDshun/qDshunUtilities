import { Injectable, inject } from "@angular/core";
import { CharacterSheetResponse } from "@models/response";
import { Observable, of } from "rxjs";
import { ApiService } from "./api.service";


@Injectable({
  providedIn: 'root'
})
export class CharacterApiService {
  private apiService = inject(ApiService);

  public getCharacterSheet(id: string): Observable<CharacterSheetResponse>{
    return of({id, fields: []})
  }

}
