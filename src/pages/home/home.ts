import { Component, ViewChild , ElementRef, ViewEncapsulation } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';
import { HotelsPage } from '../../pages/hotels/hotels';

declare var google;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      ion-tabs {
        margin-bottom: 0px;
      }
    `,
    `
      ion-tabs,
      ion-tabs .tabbar {
        position: relative;
        top: auto;
        height: auto;
        visibility: visible;
        opacity: 1;
      }
    `
  ]

})
export class HomePage {

//memebers for options and current position
  options : GeolocationOptions;
  currentPos : Geoposition
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  places : Array<any> ;
  type: string = '';

//Inject Geolocation via constructor
  constructor(public navCtrl: NavController, private geolocation : Geolocation) {

  }

//Call the getUserPosition when the view did enter
ionViewDidEnter()
{
  this.places = [];
  this.getUserPosition(this.type);
}

//Create map
addMap(lat,long,selectedType){

     let latLng = new google.maps.LatLng(lat, long);

    let mapOptions = {
    center: latLng,
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
console.log("selectedType: Add Map" + selectedType);
    this.getLocation(latLng,selectedType).then((results : Array<any>)=>{
        this.places = results;
        for(let i = 0 ;i < results.length ; i++)
        {
            this.createMarker(results[i]);
        }
    },(status)=>console.log(status));

    this.addMarker();

}

//Add Marker
addMarker(){

    let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: this.map.getCenter()
    });

    let content = "<p>This is your current position !</p>";
    let infoWindow = new google.maps.InfoWindow({
    content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
    infoWindow.open(this.map, marker);
    });

}

//getUserPosition method - display the map based on the current user position
getUserPosition(selectedType){
    this.options = {
    enableHighAccuracy : false
    };
    this.type = selectedType;
    console.log("Type - User Position:" + this.type);
    this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {

        this.currentPos = pos;

        console.log(pos);
        this.addMap(pos.coords.latitude,pos.coords.longitude,selectedType);

    },(err : PositionError)=>{
        console.log("error : " + err.message);
    ;
    })
}

//Get Location
getLocation(latLng,type)
{
  console.log("Selected Type:" + type);
    var service = new google.maps.places.PlacesService(this.map);
    let request = {
        location : latLng,
        radius : 8047 ,
        types: [type]
    };
    return new Promise((resolve,reject)=>{
        service.nearbySearch(request,function(results,status){
            if(status === google.maps.places.PlacesServiceStatus.OK)
            {
                resolve(results);
            }else
            {
                reject(status);
            }

        });
    });

}

//Create marker
createMarker(place)
{
    let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: place.geometry.location
    });
}

//show List of Hotel
showHotelsPage(selectType){
console.log("Type:" + selectType);
//Get Location
 this.getUserPosition(selectType);

this.navCtrl.push(HotelsPage,{'places' : this.places});
}

}
