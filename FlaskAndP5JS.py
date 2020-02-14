from flask import Flask, render_template, request, jsonify
import random
from BlueprintExamplePage import blueprint_example_page


# declaration of our flask object?
application = Flask(__name__)
# no cache so that flask will always check JS and CSS files for updates
application.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
# linking the blueprint page to our main page
application.register_blueprint(blueprint_example_page)
# or linking the account with a url prefix.  Now you need to type in prefixGoesHere/ before typing in the name of a page
# application.register_blueprint(blueprint_example_page, url_prefix="/prefixGoesHere")


def build_graph():
    layerOne = ["b", "c", "d"]
    layerTwo = ["e", "f", "g"]
    layerThree = ["h", "i", "j"]

    zeroOut = "a"
    OneOut = random.choice(layerOne)
    TwoOut = random.choice(layerTwo)

    graphData = \
        {
            zeroOut: layerOne,
            OneOut: layerTwo,
            TwoOut: layerThree,
        }
    return graphData


@application.route("/", methods=["GET"])
def home():
    graphData = build_graph()
    return render_template("graph.html", graphData=graphData)


@application.route("/post_new_graph", methods=["POST"])
def post_new_graph():
    graphData = build_graph()
    return jsonify(graphData)


if __name__ == "__main__":
    # debug = True means that the flask app will update itself when you change the code so you can keep it running
    # deleting "debug=True" allows the default value of debug=False to take over.
    # we want debug=False when we push this to production
    application.run(debug=True)
