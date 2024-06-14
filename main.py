import plotly.graph_objects as go

# Data for the vertices of the triangle
cost = [1, 0, 0]
risk = [0, 1, 0]
performance = [0, 0, 1]

# Create a ternary plot
fig = go.Figure(go.Scatterternary({
    'mode': 'markers+text',
    'a': performance,
    'b': risk,
    'c': cost,
    'text': ['Performance', 'Risk', 'Cost'],
    'marker': {'symbol': 100, 'color': ['red', 'green', 'blue'], 'size': 14},
}))

# Add annotations for trade-off scenarios
annotations = [
    {'a': 0.8, 'b': 0.1, 'c': 0.1, 'text': 'High Performance, Low Risk, High Cost'},
    {'a': 0.1, 'b': 0.8, 'c': 0.1, 'text': 'High Risk, Low Cost, Low Performance'},
    {'a': 0.1, 'b': 0.1, 'c': 0.8, 'text': 'High Cost, Low Risk, Low Performance'},
    {'a': 0.5, 'b': 0.5, 'c': 0.0, 'text': 'Balanced Risk and Performance, Higher Cost'},
    {'a': 0.5, 'b': 0.0, 'c': 0.5, 'text': 'Balanced Cost and Performance, Higher Risk'},
    {'a': 0.0, 'b': 0.5, 'c': 0.5, 'text': 'Balanced Cost and Risk, Lower Performance'},
]

for annotation in annotations:
    fig.add_trace(go.Scatterternary({
        'mode': 'markers+text',
        'a': [annotation['a']],
        'b': [annotation['b']],
        'c': [annotation['c']],
        'text': [annotation['text']],
        'marker': {'size': 8, 'color': 'black'},
    }))

# Update layout for better readability
fig.update_layout({
    'ternary': {
        'sum': 1,
        'aaxis': {'title': 'Performance', 'min': 0, 'linewidth': 2, 'ticks': 'outside'},
        'baxis': {'title': 'Risk', 'min': 0, 'linewidth': 2, 'ticks': 'outside'},
        'caxis': {'title': 'Cost', 'min': 0, 'linewidth': 2, 'ticks': 'outside'}
    },
    'annotations': [{
        'showarrow': False,
        'text': 'Cost, Risk, and Performance Trade-offs',
        'x': 0.5,
        'y': 1.3,
        'font': {'size': 15}
    }]
})

# Show the plot
fig.show()
