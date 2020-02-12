from flask import Flask, render_template, request, jsonify
import re
from BlueprintExamplePage import blueprint_example_page


# declaration of our flask object?
application = Flask(__name__)
# linking the blueprint page to our main page
application.register_blueprint(blueprint_example_page)
# or linking the account with a url prefix.  Now you need to type in prefixGoesHere/ before typing in the name of a page
# application.register_blueprint(blueprint_example_page, url_prefix="/prefixGoesHere")


# used to sanitize input and get rid of any characters that might be used in an injection attack
# [^a-zA-Z0-9(),.!?\"\'\s\n\t]  ^ any that isn't the following gets replaced by "".  removed.
def sanitize(my_string):
    clean_string = re.sub("[^a-zA-Z0-9(),.!?\"\'\s]", "", my_string)
    return clean_string


@application.route("/", methods=["GET"])
def home():
    return render_template("Basic.html")


@application.route("/send_data", methods=["POST"])
def send_data():
    data = \
        {
            "a": ["b", "a1", "a2"],
            "b": ["c", "b1", "b2"],
            "c": ["c1", "c2"]
        }
    return jsonify(data)


@application.route("/form_submission", methods=["POST"])
def form_submission():
    data = \
        {
            "userInput": sanitize(request.form["userInput"])
        }
    return jsonify(data)


if __name__ == "__main__":
    # debug = True means that the flask app will update itself when you change the code so you can keep it running
    # deleting "debug=True" allows the default value of debug=False to take over.
    # we want debug=False when we push this to production
    application.run(debug=True)
