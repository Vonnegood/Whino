var twitter_handles = ['2014', '2015', '2016']

Plotly.d3.csv('wine_clean.csv', (err, rows) => {
  var data = twitter_handles.map(x => {
    var d = rows.filter(r => r.twitter_handles === x)
    
    return {
      type: 'box',
      x: d.map(r => r.twitter_handles),
      y: d.map(r => r.points)
    }
  })
  
  Plotly.newPlot('graph', data);
})