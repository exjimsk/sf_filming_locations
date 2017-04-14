package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
)

type JSONData struct {
	Data [][]interface{} `json:"data"`
}

type Location struct {
	ID          float64  `json:"id"`
	Code        string   `json:"code"`
	Title       string   `json:"title"`
	Year        string   `json:"year"`
	Address     string   `json:"address"`
	Company     string   `json:"company"`
	Director    string   `json:"director"`
	Writer      string   `json:"writer"`
	Actors      []string `json:"actors"`
	Coordinates struct {
		Lat float64 `json:"lat"`
		Lng float64 `json:"lng"`
	} `json:"coordinates"`
}

type Geolocation struct {
	Results []struct {
		Geometry struct {
			Location struct {
				Lat float64 `json:"lat"`
				Lng float64 `json:"lng"`
			} `json:"location"`
		} `json:"geometry"`
	} `json:"results"`
}

func main() {

	b, err := ioutil.ReadFile("filmlocations.json")
	if err != nil {
		panic(err)
	}

	data := JSONData{}
	if err := json.Unmarshal(b, &data); err != nil {
		panic(err)
	}

	locations := []Location{}

	_locations := map[int]Location{}

	for _, d := range data.Data {
		id, ok := d[0].(float64)
		if !ok {
			continue
		}

		code, ok := d[1].(string)
		if !ok {
			continue
		}

		title, ok := d[8].(string)
		if !ok {
			continue
		}

		year, ok := d[9].(string)
		if !ok {
			continue
		}

		address, ok := d[10].(string)
		if !ok {
			continue
		}

		company, ok := d[12].(string)
		if !ok {
			continue
		}

		director, ok := d[14].(string)
		if !ok {
			continue
		}

		writer, ok := d[15].(string)
		if !ok {
			continue
		}

		actors := []string{}
		actor1, ok := d[16].(string)
		if ok {
			actors = append(actors, actor1)
		}

		actor2, ok := d[17].(string)
		if ok {
			actors = append(actors, actor2)
		}

		actor3, ok := d[18].(string)
		if ok {
			actors = append(actors, actor3)
		}

		loc := Location{
			ID:       id,
			Code:     code,
			Title:    title,
			Year:     year,
			Address:  address,
			Company:  company,
			Director: director,
			Writer:   writer,
			Actors:   actors,
		}

		u := "http://maps.googleapis.com/maps/api/geocode/json?sensor=true&address=" + url.QueryEscape(loc.Address+", San Francisco")

		fmt.Println("GET", u)

		resp, err := http.Get(u)
		if err != nil {
			panic(err)
		}

		if b, err = ioutil.ReadAll(resp.Body); err != nil {
			panic(err)
		}
		defer resp.Body.Close()

		geoloc := Geolocation{}

		if err := json.Unmarshal(b, &geoloc); err != nil {
			panic(err)
		}

		if len(geoloc.Results) == 0 {
			continue
		}

		loc.Coordinates = geoloc.Results[0].Geometry.Location

		fmt.Println(loc)

		locations = append(locations, loc)

		_locations[int(loc.ID)] = loc
	}

	if b, err = json.Marshal(_locations); err != nil {
		panic(err)
	}

	if err := ioutil.WriteFile("../assets/geolocations.json", b, os.ModePerm); err != nil {
		panic(err)
	}
}
