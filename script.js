// Create a function to color the cell
function colorCell(rank) {
  if (isNaN(rank)) return "#e3f2fd";
  var blue = [70, 130, 180];
  var orange = [255, 165, 0];
  var gradient = [];
  for (var i = 0; i < 3; i++) {
    gradient[i] = Math.round(
      blue[i] + ((rank - 1) * (orange[i] - blue[i])) / 49
    );
  }
  return "rgb(" + gradient.join(",") + ")";
}

// Create a function to color the correlation cell
function colorCellCorrelation(rank) {
  if (isNaN(rank) || rank === "--") return "#e3f2fd";
  var value = parseFloat(rank);
  if (isNaN(value)) return "#e3f2fd";
  var blue = [70, 130, 180];
  var white = [255, 255, 255];
  var red = [255, 0, 0];
  var gradient = [];
  if (value < 0) {
    for (var i = 0; i < 3; i++) {
      gradient[i] = Math.round(red[i] + (value + 1) * (white[i] - red[i]));
    }
  } else {
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
