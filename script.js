d3.csv("data.csv").then(function (data) {
  // Create a table
  var table = d3.select("#table").append("table");

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
      return colorCell(d.value);
    });
});

function colorCell(rank) {
  if (isNaN(rank)) return "#e3f2fd"; // Return light blue color for non-numeric cells (like state names)
  var blue = [70, 130, 180]; // SteelBlue color in RGB
  var orange = [255, 165, 0]; // Orange color in RGB
  var gradient = [];
  for (var i = 0; i < 3; i++) {
    gradient[i] = Math.round(
      blue[i] + ((rank - 1) * (orange[i] - blue[i])) / 49
    );
  }
  return "rgb(" + gradient.join(",") + ")";
}
