import flask


app = flask.Flask(__name__)


@app.route('/map')
def main():
    return flask.render_template('main.html')

if __name__ == '__main__':
    app.run('0.0.0.0', 80)