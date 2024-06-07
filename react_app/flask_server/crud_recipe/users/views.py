from flask import render_template, url_for, flash, redirect, request, Blueprint, Flask, send_from_directory, make_response
from flask_login import login_user, current_user, logout_user, login_required
from crud_recipe import db
from crud_recipe.reducer_function import recipe_reducer
from werkzeug.security import generate_password_hash,check_password_hash
from crud_recipe.models import User, Ingredient, Recipe, RecipeToIngredient
from crud_recipe.users.forms import RegistrationForm, LoginForm, UpdateUserForm
from flask.json import jsonify
from crud_recipe.users.forms import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, IntegerField, SelectField, TextAreaField, DateField, BooleanField
from wtforms.validators import DataRequired, Email, EqualTo
import json
# from flask_cors import CORS

# logging.getLogger('flask_cors').level = logging.DEBUG

import pint
from simple_test import test
from pint import UnitRegistry
from pint.errors import UndefinedUnitError

user_views = Blueprint('users', __name__, url_prefix='/users')


@user_views.route('/register', methods=['GET', 'POST', 'OPTIONS'])
def register():

    form_email = request.form['email']
    form_username = request.form['username']
    form_password = request.form['password']

    existing_user = User.query.filter_by(email=form_email).first()

    if existing_user:
        return jsonify({"message": "user already exists!"}), 409

    else: 
        user = User(email=form_email,
                    username=form_username,
                    password=form_password)

        db.session.add(user)
        db.session.commit()

        return jsonify(success=True, userEmail=user.email, username=user.username, userId=user.id), 200

    

@user_views.route('/login', methods=['GET', 'POST'])
def login():

    # request.args or request.json?
    form_password = request.form['password']
    form_username = request.form['username']

    # Grab the user from our User Models table
    user = User.query.filter_by(username=form_username).first()

    if user and user.check_password(form_password):
        print("great success")
        return jsonify(success=True, userEmail=user.email, username=user.username, userId=user.id), 200
    elif user and not user.check_password(form_password):
        print('username is right, password is wrong')
        return jsonify(success=False), 401
    else: 
        print('user does not exist')
        return jsonify(success=False, message="Your credentials are invalid"), 404



@user_views.route("/account", methods=['GET', 'POST'])
def account():

    form = UpdateUserForm()

    if form.validate_on_submit():

        current_user.username = form.username.data
        current_user.email = form.email.data
        db.session.commit()
        flash('User Account Updated')
        return redirect(url_for('users.account'))

    elif request.method == 'GET':
        form.username.data = current_user.username
        form.email.data = current_user.email

        return render_template('account.html', form=form)



@user_views.route("/myrecipes", methods=['GET', 'POST'])
def view_users_recipes():

    user_Id = request.args.get('userId', '')

    # user = User.query.filter_by(id=user_id).first_or_404()
    user_recipes = Recipe.query.filter_by(user_id=user_Id).order_by(Recipe.date.desc()).all()
    
    recipes_formatted = [recipe.to_json() for recipe in user_recipes]

    if not user_recipes:
        return jsonify(message='no recipes to display'), 204
    else:
        return recipes_formatted, 200

    



@user_views.route("/myrecipes/generatelist", methods=['GET', 'POST'])
def generate_shopping_list():

 
    # print('generate shopping list view hit')
    request_data = request.data
    json_loads_recipe_ids = json.loads(request_data)
    recipe_ids = json_loads_recipe_ids['recipeIds']

    
    # finds all ingredients from a list of recipe ids
    recipe_ingredients_result = (
                db.session.query(Ingredient.name, RecipeToIngredient.ingredient_quantity, RecipeToIngredient.ingredient_measurement)
                .join(Ingredient, RecipeToIngredient.ingredient_id == Ingredient.id)
                .where(RecipeToIngredient.recipe_id.in_(recipe_ids))
                ).all()

    # variable holds the returned result of our reducer function 
    shopping_list_ingredients = recipe_reducer(recipe_ingredients_result)

    sorted_ingredients = sorted(shopping_list_ingredients)

    return jsonify(ingredients_reduced=sorted_ingredients, success=True), 200



    




 








