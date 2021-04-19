import React, { Component } from "react";

import {
  View,
  Dimensions,
  TouchableWithoutFeedbackBase,
  TouchableOpacity,
} from "react-native";

import moment from "moment";
import { Svg, Polyline, Circle, parse, Text, G } from "react-native-svg";

class Calendars extends Component {
  constructor(props) {
    super(props);
    this.state = {
      months: [],
      quotesThisMonth: [],
      quotesCopy: null,
      chosenMonthCopy: null,
    };
  }
  componentDidMount() {
    this.filterQuotes();
    console.log("weszismy");
  }

  dummyfunc() {
    console.log("halko");
  }
  filterQuotes() {
    let filtered = [];
    if (!this.props.withMonth) {
      for (let i = 0; i < this.props.quotes.length; i++) {
        let quoteMonth = moment(this.props.quotes[i].dateAdded).month();
        let quoteYear = moment(this.props.quotes[i].dateAdded).year();
        let currMoth = moment().month();
        let currYear = moment().year();
        if (quoteMonth == currMoth && currYear == quoteYear) {
          filtered.push(this.props.quotes[i]);
        }
      }
      this.setState({
        quotesThisMonth: filtered,
        quotesCopy: this.props.quotes,
      });
    } else {
      if (this.props.chosenMonth) {
        for (let i = 0; i < this.props.quotes.length; i++) {
          let quoteMonth = moment(this.props.quotes[i].dateAdded).month();
          let quoteYear = moment(this.props.quotes[i].dateAdded).year();
          let myChosenMonth = this.props.chosenMonth.month();
          let myChosenYear = this.props.chosenMonth.year();

          if (quoteMonth == myChosenMonth && quoteYear == myChosenYear) {
            filtered.push(this.props.quotes[i]);
          }
        }
        this.setState({
          quotesThisMonth: filtered,
          quotesCopy: this.props.quotes,
          chosenMonthCopy: this.props.chosenMonth,
        });
      }
    }
  }

  handleSmallCirclePress(quote) {
    if (quote.visible) {
      console.log(this.props, 'test 123')
      this.props.parentProps.navigation.navigate("buildMainPage", {
        quoteID: quote.quoteID,
        uuID: this.props.uuID
      });
    }
  }

  drawSmallCircles(x, y, R, width, daysInMonth) {
    let fullOutput = [];
    let circleMy = 0;
    for (let i = 0; i < this.state.quotesThisMonth.length; i++) {
      let date = moment(this.state.quotesThisMonth[i].dateAdded).format("DD");

      let angle = -(date - 1) * (360 / daysInMonth);

      let radian = angle * (Math.PI / 180) + Math.PI / 2;
      let circlesX = x + R * Math.cos(radian);
      let circlesY = y - R * Math.sin(radian);

      //check title
      let mystrokecolor = "#c8bfe7";
      let myfillcolor = "#c8bfe7";
      switch (this.state.quotesThisMonth[i].title) {
        case "I LEARNT":
          mystrokecolor = "yellow";
          myfillcolor = "yellow";
          break;
        case "I ACHEIVED":
          mystrokecolor = "green";
          myfillcolor = "green";
          break;
        case "I TRIED":
          mystrokecolor = "orange";
          myfillcolor = "orange";
          break;
        default:
          break;
      }
      if (this.state.quotesThisMonth[i].visible) {
        circleMy = (
          <Circle
            key={i}
            cx={circlesX}
            cy={circlesY}
            r={width / 4}
            key={i}
            stroke={mystrokecolor}
            strokeWidth={1}
            fill={myfillcolor}
            onPress={() => {
              console.log(this.props, 'this.state.quotesThisMonth')
              this.props.parentProps.navigation.navigate("buildMainPage", {
                quoteID: this.state.quotesThisMonth[i].quoteID,
                uuID: this.props.uuID,
                date: this.state.quotesThisMonth[i].dateAdded
              });
            }}
          />
        );
      } else {
        circleMy = (
          <Circle
            key={i}
            cx={circlesX}
            cy={circlesY}
            r={width / 4}
            key={i}
            stroke={mystrokecolor}
            strokeWidth={1}
            fill={myfillcolor}
          />
        );
      }

      fullOutput.push(circleMy);
    }

    if (fullOutput.length > 0) {
      return fullOutput;
    } else {
      return null;
    }
  }

  createCircle() {
    if (
      this.props.quotes != this.state.quotesCopy ||
      this.state.chosenMonthCopy != this.props.chosenMonth
    ) {
      this.filterQuotes();
    }
    let x = parseInt(Dimensions.get("window").width * this.props.width * 0.5); //nadpisujemy tutaj
    let y = parseInt(Dimensions.get("window").width * this.props.width * 0.5);

    let R =
      (4 / 9) * parseInt(Dimensions.get("window").width * this.props.width);

    let width = R / 4;
    let r = R - width;
    let points = "";
    let currentMonth = 0;
    let daysInMonth = 0;
    if (!this.props.withMonth) {
      currentMonth = moment().format("MMMM").toUpperCase();
      daysInMonth = moment().daysInMonth();
    } else {
      if (this.props.chosenMonth) {
        daysInMonth = this.props.chosenMonth.daysInMonth();
      }
    }

    let angle = 0;
    let startpointXSmall, startpointYSmall, endpointXBig, endpointYBig;
    let myTry = [];

    for (let i = 0; i < daysInMonth; i++) {
      angle = i * (360 / daysInMonth);
      let offset = -(360 / (2 * daysInMonth)) * (Math.PI / 180);
      let radian = Math.PI / 2 - angle * (Math.PI / 180) + offset;
      startpointXSmall = x + (r - width / 2) * Math.cos(radian);
      startpointYSmall = y - (r - width / 2) * Math.sin(radian);
      endpointXBig = x + (R + width / 2) * Math.cos(radian);
      endpointYBig = y - (R + width / 2) * Math.sin(radian);

      if (i == 0) {
        points +=
          startpointXSmall +
          " " +
          startpointYSmall +
          " L" +
          endpointXBig +
          " " +
          endpointYBig +
          " ";
      } else {
        points +=
          "M" +
          startpointXSmall +
          " " +
          startpointYSmall +
          " L" +
          endpointXBig +
          " " +
          endpointYBig +
          " ";
      }

      let tekst = 0;
      if (i < 9) {
        tekst = "0" + (i + 1);
      } else {
        tekst = i + 1;
      }

      myTry.push(
        <Text
          fill="#3f32d2"
          fontWeight="bold"
          key={i}
          x={x + r * Math.cos(radian - 0.95 * offset)}
          y={y - r * Math.sin(radian - 0.95 * offset)}
          //rotate="10"
          textAnchor="middle"
          alignmentBaseline="central"
        >
          {tekst}
        </Text>
      );
    }

    return (
      <Svg
        width={2 * R + width}
        height={2 * R + width}
        style={{ marginTop: "5%" }}
      >
        <Circle
          cx={x}
          cy={y}
          r={R}
          stroke="#3f32d2"
          strokeWidth={width}
          fill="white"
        />
        {this.props.withMonth === false ? (
          <Circle
            cx={x}
            cy={y}
            r={r - width / 2}
            stroke="black"
            strokeWidth={1}
            fill="#f7fcff"
            onPress={() => {
              this.props.parentProps.navigation.navigate("BuildPage", {
                uuID: this.props.parentProps.route.params.uuID,
              });
            }}
          />
        ) : (
          <Circle
            cx={x}
            cy={y}
            r={r - width / 2}
            stroke="black"
            strokeWidth={1}
            fill="#f7fcff"
          />
        )}

        <Polyline
          points={points}
          fill="yellow"
          stroke="black"
          strokeWidth="1"
        />

        {this.drawSmallCircles(x, y, R, width, daysInMonth)}
        {this.props.small === false ? myTry : null}
        {this.props.withMonth === false ? (
          <Text
            fill="black"
            fontSize="25"
            x={x}
            y={y}
            textAnchor="middle"
            alignmentBaseline="central"
          >
            {currentMonth}
          </Text>
        ) : null}
      </Svg>
    );
  }

  render() {
    return this.createCircle();
  }
}
export default Calendars;
