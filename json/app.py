import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///wine_db.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
# Samples_Metadata = Base.classes.
Samples = Base.classes.wine_db


@app.before_first_request
def make_tables():
    db.create_all()

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")
    # return "hey"



@app.route("/metadata")
def sample_metadata():
    """Return the MetaData for a given sample."""
    # sel = [
    #     Samples_Metadata.sample,
    #     Samples_Metadata.ETHNICITY,
    #     Samples_Metadata.GENDER,
    #     Samples_Metadata.AGE,
    #     Samples_Metadata.LOCATION,
    #     Samples_Metadata.BBTYPE,
    #     Samples_Metadata.WFREQ,
    # ]

    results = db.session.query(Samples).limit(100).all()

    payload = []
    for result in results:
        d = {}
        for col in Samples.__table__.columns:
            d[col.name] = getattr(result, col.name)
        payload.append(d)

    # Create a dictionary entry for each row of metadata information
    # sample_metadata = {}
    # for result in results:
    #     sample_metadata["sample"] = result[0]
    #     sample_metadata["ETHNICITY"] = result[1]
    #     sample_metadata["GENDER"] = result[2]
    #     sample_metadata["AGE"] = result[3]
    #     sample_metadata["LOCATION"] = result[4]
    #     sample_metadata["BBTYPE"] = result[5]
    #     sample_metadata["WFREQ"] = result[6]

    # print(sample_metadata)
    return jsonify(payload)



if __name__ == "__main__":
    app.run(debug=True, port=5000)



