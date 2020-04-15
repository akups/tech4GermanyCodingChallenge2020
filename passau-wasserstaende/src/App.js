import React, { Component } from "react";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      isLoaded: false,
    };
  }

  componentDidMount() {
    fetch(
      "https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations.json?includeTimeseries=true&includeCurrentMeasurement=true"
    )
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          data: json.filter((el) => {
            if (el.longname.includes("PASSAU")) {
              return true;
            }
          }),
          isLoaded: true,
        });
      });
  }
  render() {
    const { isLoaded, data } = this.state;
    if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <React.Fragment>
          <h1>Wasserstände der vier Passauer Messstellen</h1>
          <table>
            <thead>
              <tr>
                <th>Name des Messstelle</th>
                <th>Name des Behorde</th>
                <th>Datum und Uhrzeit</th>
                <th>Neusten Messwerte (cm)</th>
                <th>Trend</th>
                <th>Meldestufe Zustand</th>
              </tr>
            </thead>
            <tbody>
              {data.map((el) => (
                <tr>
                  <td>{el.longname}</td>
                  <td>{el.agency}</td>
                  {el.timeseries.map((series) => {
                    if (series.shortname === "W") {
                      return (
                        <React.Fragment>
                          <td>{Date(series.currentMeasurement.timestamp)}</td>
                          <td>{series.currentMeasurement.value}</td>
                          {/* <td>{series.currentMeasurement.trend}</td> */}
                        </React.Fragment>
                      );
                    } else if (el.longname === "PASSAU LUITPOLDBRÜCKE DFH") {
                      return (
                        <React.Fragment>
                          {/* //die Passau LUITPOLDBRÜCKE hat ein höhe von 515cm */}
                          <td>{Date(series.currentMeasurement.timestamp)}</td>
                          <td>{series.currentMeasurement.value - 515}</td>
                          {/* <td>{series.currentMeasurement.trend}</td> */}
                        </React.Fragment>
                      );
                    } else if (el.longname === "PASSAU STEINBACHBRÜCKE DFH") {
                      return (
                        <React.Fragment>
                          {/* die Passau STEINBACHBRÜCKE hat ein höhe von 465cm */}
                          <td>{Date(series.currentMeasurement.timestamp)}</td>
                          <td>{series.currentMeasurement.value - 465}</td>
                          {/* <td>{series.currentMeasurement.trend}</td> */}
                        </React.Fragment>
                      );
                    }
                  })}
                  {el.timeseries.slice(0, 1).map((series) => {
                    let trend = series.currentMeasurement.trend;
                    {
                      switch (trend) {
                        case (trend = 0):
                          return (
                            <React.Fragment>
                              <td>bleibend</td>
                            </React.Fragment>
                          );
                        case (trend = -1):
                          return (
                            <React.Fragment>
                              <td>fallend</td>
                            </React.Fragment>
                          );
                        case (trend = 1):
                          return (
                            <React.Fragment>
                              <td>steigend</td>
                            </React.Fragment>
                          );
                        default:
                          return (
                            <React.Fragment>
                              <td>kein wert gegeben</td>
                            </React.Fragment>
                          );
                      }
                    }
                  })}
                  {el.timeseries.slice(0, 1).map((series) => {
                    let werte =
                      series.currentMeasurement.value - 465 ||
                      series.currentMeasurement.value - 515 ||
                      series.currentMeasurement.value;
                    {
                      switch (werte) {
                        case werte >= 700 && werte < 740:
                          return (
                            <React.Fragment>
                              <td>Meldestufe '1'</td>
                            </React.Fragment>
                          );
                        case werte >= 740 && werte < 770:
                          return (
                            <React.Fragment>
                              <td>Meldestufe '2'</td>
                            </React.Fragment>
                          );
                        case werte >= 770 && werte < 850:
                          return (
                            <React.Fragment>
                              <td>Meldestufe '3'</td>
                            </React.Fragment>
                          );
                        case werte >= 850:
                          return (
                            <React.Fragment>
                              <td>Meldestufe '4'</td>
                            </React.Fragment>
                          );
                        default:
                          return (
                            <React.Fragment>
                              <td>keine Meldung</td>
                            </React.Fragment>
                          );
                      }
                    }
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </React.Fragment>
      );
    }
  }
}
