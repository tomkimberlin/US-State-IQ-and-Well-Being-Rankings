// Colors cell based on rank. Higher rank is closer to orange and lower rank is closer to blue.
function colorCell(rank) {
  // If rank is not a number, return a light blue color (for non-numeric cells like state names)
  if (isNaN(rank)) return "#e3f2fd";

  // SteelBlue color in RGB
  var blue = [70, 130, 180];
  // Orange color in RGB
  var orange = [255, 165, 0];

  var gradient = [];

  // Loop to generate gradient color for cell based on rank
  for (var i = 0; i < 3; i++) {
    gradient[i] = Math.round(
      blue[i] + ((rank - 1) * (orange[i] - blue[i])) / 49
    );
  }

  return "rgb(" + gradient.join(",") + ")";
}

// Colors cell based on correlation value. Negative values are closer to red, positive values are closer to blue.
function colorCellCorrelation(rank) {
  // If rank is not a number or is '--', return a light blue color (for non-numeric cells like state names or '--' cells)
  if (isNaN(rank) || rank === "--") return "#e3f2fd";

  var value = parseFloat(rank);

  // If value is not a number after conversion, return a light blue color
  if (isNaN(value)) return "#e3f2fd";

  // SteelBlue color in RGB
  var blue = [70, 130, 180];
  // White color in RGB
  var white = [255, 255, 255];
  // Red color in RGB
  var red = [255, 0, 0];

  var gradient = [];

  if (value < 0) {
    // Negative values are closer to red
    for (var i = 0; i < 3; i++) {
      gradient[i] = Math.round(red[i] + (value + 1) * (white[i] - red[i]));
    }
  } else {
    // Positive values are closer to blue
    for (var i = 0; i < 3; i++) {
      gradient[i] = Math.round(white[i] + value * (blue[i] - white[i]));
    }
  }

  return "rgb(" + gradient.join(",") + ")";
}

// Function to create a table
function createTable(data, id, title, colorFunction) {
  // Create a new div
  var tableSection = d3.select("main").append("section").attr("id", id);

  // Add h2 title for the table
  tableSection.append("h2").text(title);

  // Create a table
  var table = tableSection.append("table");

  // Create table header
  var thead = table.append("thead");
  thead
    .append("tr")
    .selectAll("th")
    .data(data.columns)
    .enter()
    .append("th")
    .text(function (d) {
      return d;
    });

  // Create table body
  var tbody = table.append("tbody");

  // Bind data to rows
  var rows = tbody.selectAll("tr").data(data).enter().append("tr");

  // Bind data to cells
  var cells = rows
    .selectAll("td")
    .data(function (row) {
      return data.columns.map(function (column) {
        return { column: column, value: row[column] };
      });
    })
    .enter()
    .append("td")
    .text(function (d) {
      return d.value;
    })
    .style("background-color", function (d) {
      return colorFunction(d.value);
    });
}

// Load both CSV files and create tables once the data is ready
Promise.all([d3.csv("rankings.csv"), d3.csv("correlations.csv")]).then(
  function (values) {
    createTable(values[0], "mainTable", "U.S. State Rankings", colorCell);
    createTable(
      values[1],
      "correlationTable",
      "Correlations Between Factors",
      colorCellCorrelation
    );
  }
);
