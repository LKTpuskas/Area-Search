'use strict';

/**
 * Lorenz Puskas
 */


var Mainbody = React.createClass({
        getInitialState: function () {

            return {
                mashupData: []
            };
        },


        /**
         * look up the link above and try
         */
        dropdownsearch: function () {
            var title = document.getElementById('dropdown').value;
            var dataList = document.getElementById('json-datalist');
            var backendData = "/search?q=";
            fetch(backendData + title, {
                method: 'get', headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (res) {
                return res.json();
            }).then((data) => {
                for (var i = 0; i < data.length; i++) {
                    // Create a new <option> element.
                    var item = data[i];
                    var option = document.createElement('option');
                    // Set the value using the item in the JSON array.
                    option.value = item.Address;
                    // Add the <option> element to the <datalist>.
                    dataList.appendChild(option);
                }


            });
        },

        /**
         * makeRequest
         * Fetching method. Retrieves the backend data.
         * @param e
         */
        makeRequest: function (e) {
            // var citys = $('#cities option:selected').text();
            e.preventDefault();
            var title = document.getElementById('dropdown').value;
            console.log(title);

            var backendData = "/search?q=";
            var vidobj = [];
            var databulk = [];
            if (title !== "") {
                fetch(backendData + title, {
                    method: 'get', headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function (response) {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    return response.json();
                }).then((res) => { // Calls fetch function, fetches the user-input
                    console.log(res);
                    if (res.err) {
                        alert(res.error);
                        console.log(res.error.message);
                    } else {
                        for (var i = 0; i < res.length; i++) {
                            var mergedobj = res[i];
                            databulk.push(mergedobj);
                        }
                        $('#data-section').fadeIn('slow');
                        $('#dynamicarrow').fadeIn('slow');

                        this.setState({
                            mashupData: databulk
                        });
                        console.log(this.state.mashupData);
                    }
                }).catch(function (error) {
                    alert("There are no areas called like that, please try again");
                });
            } else {
                alert("NO INPUT GIVEN");
            }
        },

        clear: function () {
            this.setState({
                mashupData: []
            })
        },

        render: function () {
            return (
                <div className="react-container">

                    <form className="input-area" onSubmit={this.makeRequest}>
                        <input type="text" id="dropdown" list="json-datalist" placeholder=""/>
                        <datalist id="json-datalist">
                        </datalist>
                        <br/>
                        <div className="buttons">
                            <input name="S" value="FETCH" id="requestbtn" type="submit"/>
                            <input type="button" value="CLEAR" id="clear" onClick={this.clear}/>
                        </div>
                        <div id="dynamicarrow">SCROLL DOWN</div>
                    </form>
                    <div className="loading"></div>
                    <div id="data-section">
                        <AreaFacts mashupData={this.state.mashupData}/>

                        <Youtube mashupData={this.state.mashupData}/>

                        <StreetView mashupData={this.state.mashupData}/>

                    </div>


                </div>

            )
        }
    });

/**
 * AreaFacts
 * Displays the data from PlaceILive API
 * @type {*}
 */
var AreaFacts = React.createClass({
    render: function () {
        if (this.props.mashupData) {
            var mashupData = this.props.mashupData.map(function (item) {
                if (item.address !== undefined && item.lat !== undefined && item.lng !== undefined) {
                    return (
                        <div className="areafacts-container" key={item.id}>


                            <div className="facts-holder">
                                <h3 className="p-address">{item.address}</h3>

                                <h4 className="p-info">{item.lqi_dailylife.type} : {item.lqi_dailylife.label} </h4>
                                <h4 className="p-info"> Value : {item.lqi_dailylife.value}</h4>
                                <img className="" width="50" height="50" src={item.lqi_dailylife.icon}/>

                                <h4 className="p-info">{item.lqi_safety.type} : {item.lqi_safety.label}</h4>
                                <h4 className="p-info"> Value : {item.lqi_safety.value}</h4>
                                <img className="" width="50" height="50" src={item.lqi_safety.icon}/>

                                <h4 className="p-info">{item.lqi_transportation.type}
                                    : {item.lqi_transportation.label}</h4>

                                <h4 className="p-info">Value : {item.lqi_transportation.value}</h4>
                                <img className="" width="50" height="50" src={item.lqi_transportation.icon}/>

                                <h4 className="p-info">{item.lqi_dailylife.type} : {item.lqi_dailylife.label}</h4>
                                <h4 className="p-info">Value : {item.lqi_dailylife.value}</h4>
                                <img className="" width="50" height="50" src={item.lqi_dailylife.icon}/>

                                <h4 className="p-info">{item.lqi_sports.type} : {item.lqi_sports.label}</h4>

                                <h4 className="p-info">Value : {item.lqi_sports.value}</h4>
                                <img className="" width="50" height="50" src={item.lqi_sports.icon}/>

                                <h4 className="p-info">{item.lqi_entertainment.type}
                                    : {item.lqi_entertainment.label}</h4>
                                <h4 className="p-info">Value : {item.lqi_entertainment.value}</h4>
                                <img className="" width="50" height="50" src={item.lqi_entertainment.icon}/>

                                <h4 className="p-info">{item.lqi_demographics.type} : {item.lqi_demographics.label}</h4>
                                <h4 className="p-info">Value : {item.lqi_demographics.value}</h4>
                                <div className="catimg">
                                    <img width="50" height="50" src={item.lqi_demographics.icon}/>
                                </div>
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div className="areafacts-container" key={item.id}>

                            <div className="facts-holder"></div>
                        </div>
                    );
                }


            }.bind(this));
        }
        return <div className="areafacts-center">{mashupData}</div>;

    }
});


/**
 * Youtube API
 * @type {*}
 */
var Youtube = React.createClass({
    render: function () {
        if (this.props.mashupData) {
            var mashupData = this.props.mashupData.map(function (item) {

                if (item.vidId !== undefined) {
                    return (
                        <div className="youtube-padding" key={item.id}>

                            <iframe width="100%" height="460" frameBorder="0"
                                    className="youtube-frame" src={'//www.youtube.com/embed/' + item.vidId}
                                    allowFullScreen="true"/>

                        </div>
                    );
                }
            }.bind(this));
        }
        return <div className="youtube">{mashupData}</div>;

    }
});


/**
 * GoogleStreetView API
 * @type {*}
 */
var StreetView = React.createClass({
    render: function () {
        if (this.props.mashupData) {

            var mashupData = this.props.mashupData.map(function (item) {

                var apikey = ""; // GoogleStreetView APIkey here
                var location = "&location=";
                if (item.lat && item.lng !== 'NA') {

                    return (

                        <div className="" key={item.id}>
                            <iframe className="framesize"
                                    frameBorder="0"
                                    src={"https://www.google.com/maps/embed/v1/search?key=" + apikey + "&q=" + item.address}
                                    id="street">
                            </iframe>
                            <iframe className="framesize"
                                    frameBorder="0"
                                    src={"https://www.google.com/maps/embed/v1/streetview?key=" + apikey + location +
                                    item.lat + "," + item.lng +
                                    "&heading=210&pitch=10 &fov=35"} id="street">
                            </iframe>
                            {/*<span className="spanfield">{item.Lat} </span>
                             <span className="spanfield">{item.Lng} </span>*/}
                        </div>

                    );
                } else {
                    console.log("missing maps");
                }
            }.bind(this));

        }
        return <div className="streetview-right">{mashupData}</div>;

    }
});

ReactDOM.render(
    <Mainbody/>,
    document.getElementById('reactdata')
);


