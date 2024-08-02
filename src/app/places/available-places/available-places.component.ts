import { Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import{catchError, map, single, throwError } from 'rxjs';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  error= signal('');
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  private httpClient= inject(HttpClient);
  private destroyRef= inject(DestroyRef);

  ngOnInit(){
    this.isFetching.set(true);
     const subsription =this.httpClient.get< {places: Place[] }>('http://localhost:3000/places')
     .pipe(
      map((resData) => resData.places), catchError((error)=> throwError(()=> new Error('Something went wrong. Try again later!')) )
     )
     .subscribe({
      next: (places)=> {
        //console.log(resData); //rturn value is HttpResponse all its properties as well as body where is the actual response
        this.places.set(places);
      },
      error: (error: Error) => {
        console.log(error);
        this.error.set(error.message);
      },
      complete: () => {
        this.isFetching.set(false);
      }
     });

     this.destroyRef.onDestroy(() => {
        subsription.unsubscribe();
     })
  }
}
