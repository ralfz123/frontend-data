##### Frontend Data 20-21
# The car in the city
<!-- [_imageOfProduct_] -->
<!-- [_linkOfDeployment_Netlify_] -->
_Frontend Data, a course of the Tech-track of Information Design. It is a thema semester of the third year from the study [CMD](https://www.cmd-amsterdam.nl/). In this course I will learn to clean raw data, transform the data and apply it in a datavisualization using D3._

## :rocket: Purpose of Project
Commissioned by de Volkskrant, I have to look for an interesting angle on 'The car in the city'. This allows me to help the editorial staff of de Volkskrant to write interesting and new articles.
In this project, I take an interesting research question and research it completely. I am going to look at what data is available in the [RDW datasets](https://opendata.rdw.nl/browse?category=Parkeren&provenance=official&page=1) that we have received. I will also clean up this data and transform it into usable data. With this data and the research question (which I want to answer) I will make a data visualization using [D3](https://d3js.org/).

## :heart_eyes: Concept
### Research Question
**What is the ideal place in the city to live as a driver of an electric car?**  
_My assumption is that it will be very difficult for drivers of electric cars in the city. I think if you live more in the center, then you have more parking areas with charging points than you live further away from the center._

#### Sub questions
1. When is it busy in the parking areas (in parking lots / in parking garages)?
   _My assumption is that it can be very busy, especially on holidays and weekends._
2. Is it busier in the evening than during the day in the parking areas?
    _My assumption is that there is a certain balance in terms of activity between daytime and evening. People work during the day (now mainly at home #corona) and most people are at home in the evening._
3. Is it possible to reserve a parking space?
    _My assumption is that there are subscriptions to parking areas and that you therefore have priority to park somewhere._
4. Is there a maximum time that you can park in a parking space (parking times in connection with the car charged)?
    _My assumption is that you can park in a parking area indefinitely, but that there are opening and closing times for a parking area._
5. Why are there not several electric charging points at parking places (outside the center)?
    _My assumption is that there is not enough enthusiasm for that (because not many people have an electric car yet) ._
6. Why are there only electric cars allowed in such a parking lot?
    _My assumption is that there are parking areas that are only intended for electric cars._
7. How expensive is it for electric cars to park?
    _My assumption is that parking is the same for both electric cars and normal cars. By the way, this depends on where you park._

### :bulb: Idea
I want to make a data visualization, using D3, to show the reader how 'ideal' the life is of an electric car driver who lives in the city while still having to charge his / her car.

<img src="https://raw.githubusercontent.com/wiki/ralfz123/functional-programming/img/sketch_v1.jpg" alt="first-sketch" width="600px">

## :1234: Data  
I think I can use [this data](https://github.com/ralfz123/functional-programming/wiki/Onderzoek-%F0%9F%94%8D#data) for my subject.
The data variables I think I can use, are:
- `AreaId` - [this](https://opendata.rdw.nl/Parkeren/Open-Data-Parkeren-GEBIED/adw6-9hsg) or [this](https://opendata.rdw.nl/Parkeren/Open-Data-Parkeren-GEOMETRIE-GEBIED/nsk3-v9n7)
- `GeoDataAsText` - [Dataset](https://opendata.rdw.nl/Parkeren/Open-Data-Parkeren-GEOMETRIE-GEBIED/nsk3-v9n7)
- `ChargingPointCapacity` - [Dataset](https://opendata.rdw.nl/Parkeren/Open-Data-Parkeren-SPECIFICATIES-PARKEERGEBIED/b3us-f26s)

👉 Click [here](https://github.com/ralfz123/functional-programming/wiki/Onderzoek-%F0%9F%94%8D) for more details about my project research.

### Dataset structure
```
{
 point: {
  lat: 52.21061864,
  lng: 5.17506312
},
 id: "28008b58-5a03-11ea-8ed4-42010a840fd0",
 status: {
  available: "2",
  charging: "0"
}
```


## :nerd_face: Technical summary
This data visualization will be built, using:
- JavaScript
- D3
- [Functional Programming Patterns](https://github.com/ralfz123/functional-programming/wiki/Functional-Patterns)

## :gear: Install
1. Clone the repository:  
```
git clone https://github.com/ralfz123/functional-programming.git
```

2. Install dependencies   
```
npm install
```

3. To run the app   
```
python -m SimpleHTTPServer 8000  
```

4. Go to [localhost](http://localhost:8000/) in the browser
```
http://localhost:8000/
```


## :file_folder: Resources
Credits to [Danny de Vries](https://github.com/dandevri) && [Laurens Aarnoudse](https://github.com/Razpudding) && [Robert Spier](https://github.com/roberrrt-s) for giving interesting lectures about Functional Programming and how to deal with it.

- Aarnoudse, L.  (2020, October 28). Rubric. Consulted from https://github.com/cmda-tt/course-20-21

## :cop: License
This project from [Ralf](https://github.com/ralfz123) has a [MIT © License](https://github.com/ralfz123/frontend-data/blob/main/LICENSE)
