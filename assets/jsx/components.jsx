class AppView extends React.Component {
	render() {
		var resultCount = Object.keys(this.state.locations).reduce((a, b) => {
			if (this.state.locations[b].filtered == false) {
				return a + 1
			} else {
				return a
			}
		}, 0)
		
		return (
		<div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", height: "100%", padding: 10}}>
			
			<div id="map-container" style={{flexGrow: 1, width: "60%", height: "95%", top: -15}}>
				
			</div>

			<div id="details-container" style={{width: "40%", display: "flex", flexDirection: "column", height: "95%", padding: "0 10 30 20"}}>
				<div id="title" style={{}}>
					<h4 style={{padding: 0, margin: "5 0"}}>Movies Filming Locations in San Francisco</h4>
				</div>

				<div id="input-container" style={{width: "100%"}}>
					<input type="text" 
						placeholder="movie"
						defaultValue="" 
						ref={(e) => {this.input = e}}
						onChange={this.onChangeInput.bind(this)} 
						style={{width: "100%", padding: "3 8", outline: "none"}}/>
						
					<div style={{fontSize: "0.8em", fontWeight: 200, padding: "2 5", color: "rgb(180,180,180)"}}>
						Showing {resultCount} result{resultCount > 1 ? "s" : ""}
					</div>
				</div>

				<div id="filtered-locations" style={{flexGrow: 1, overflowY: "scroll", padding: "10 0 0 0"}}>
					{Object.keys(this.state.locations).map((id) => {
						var l = this.state.locations[id]
						
						return (
						<div className="cell" style={{display: l.filtered == false ? "flex" : "none", flexDirection: "column", padding: "4 5", borderBottom: "1px solid rgb(200,200,200)"}}>
							<span style={{color: "rgb(100,100,100)"}}>{l.address}</span>
							<span style={{color: "rgb(170,170,170)", fontSize: "0.8em", fontWeight: 200}}>{l.title} ({l.year})</span>
						</div>)
					})}
				</div>
			</div>
		</div>)
	}
	
	constructor(props) {
		super(props)
		this.state = {
			locations: {}
		}
		
		this.titles = {}
	}

   initMap() {
		this.map = new google.maps.Map(document.getElementById("map-container"), {
			zoom: 12,
			center: {lat: 37.725, lng: -122.44}
		})
   	
   	Object.keys(this.state.locations).map((id) => {
   		var loc = this.state.locations[id]
   		var coordinates = loc.coordinates

			loc.marker = new google.maps.Marker({
				position: coordinates,
				map: this.map,
				title: loc.address
			})
			
			loc.marker.setMap(this.map)
   	})
   }
	
	
	buildLocationIndices() {
		for (var id in this.state.locations) {
			var l = this.state.locations[id]
			var t = l.title.toLowerCase()
			
			if (!this.titles[t]) {
				this.titles[t] = [id]
			} else {
				this.titles[t].push(id)
			}
		}
	}
	
	componentDidMount() {
		$.ajax("/locations.json", {
			success: (locations) => {
				for (var id in locations) {
					locations[id].filtered = false
				}
				
				this.setState({
					locations: locations
				}, () => {
					this.initMap()
					
					console.log("locations downloaded", this.state)
					this.input.focus()
					
					this.buildLocationIndices()
				})
			},
			error: () => {
				alert("unable to load locations")
			}
		})
	}
	
	onChangeInput(e) {
		var v = e.target.value
		// var locations = this.state.locations

		for (var title in this.titles) {
			var filtered = title.indexOf(v) == -1
			
			this.titles[title].map((id) => {				
				this.state.locations[id].filtered = filtered
				this.state.locations[id].marker.setMap(filtered ? null : this.map)
			})
		}
		
		this.forceUpdate()
		// this.setState({
		// 	locations: locations
		// })
	}
}
