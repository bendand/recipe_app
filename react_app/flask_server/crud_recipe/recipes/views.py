from flask import render_template,url_for,flash,redirect,request,Blueprint,abort
from flask_login import current_user,login_required
from crud_recipe import db
from crud_recipe.models import Ingredient,Recipe,RecipeToIngredient,User
from crud_recipe.recipes.forms import RecipeForm
import datetime
from sqlalchemy import select,delete
from pint import UnitRegistry, DimensionalityError
from crud_recipe.validate_recipe_form import ValidationError,validate_add_recipe_form
import json
from flask.json import jsonify
from pint import UnitRegistry
from flask_json import FlaskJSON, JsonError, json_response, as_json


recipe_views = Blueprint('recipes',__name__, url_prefix='/recipes')

@recipe_views.route("/add", methods=['GET', 'POST'])
def add_recipe():

    data = request.get_json()
    recipe_name = data['recipe']
    recipe_user_id = data['userId']

    if not data:
        return jsonify(success=False), 404


    new_recipe = Recipe(name=recipe_name, user_id=recipe_user_id)
    
    db.session.add(new_recipe)
    db.session.commit()
    # print(new_recipe)

    recipe_ingredients = data['ingredients']

    # iterating through 
    for ingredient in recipe_ingredients:
        ingredient_name = ingredient['name']
        ingredient_quantity = float(ingredient['quantity'])
        ingredient_measurement = ingredient['measurement']

        # produces a name or a none value in this variable
        ingredient = Ingredient.query.filter_by(name=ingredient_name).first()

        # if the ingredient is not in the ingredient table...
        if not ingredient:

            # create an instance of ingredient and commit 
            ingredient = Ingredient(name=ingredient_name)
            
            # commits this so we can identify our ingredient by primary key
            db.session.add(ingredient)
            db.session.commit()

        # this then needs to be done regardless of whether or not the ingredient has been added to our database before
        recipe_to_ingredient = RecipeToIngredient(recipe_id=new_recipe.id,
                                                ingredient_id=ingredient.id, 
                                                ingredient_quantity=ingredient_quantity, 
                                                ingredient_measurement=ingredient_measurement)

        db.session.add(recipe_to_ingredient)
        db.session.commit()
        

    return jsonify(success=True), 200



# int: makes sure that the recipe_id gets passed as in integer
# instead of a string so we can look it up later.
@as_json
@recipe_views.route('/viewrecipeingredients', methods=['GET'])
def recipe_view():

    # grabs our recipe id from the request
    recipe_id = request.args.get('recipeId', '')

    # grab the requested recipe by id number or return 404
    recipe = Recipe.query.get_or_404(recipe_id)

    # need some way below here to make all the ingredients in the recipe given above available for enumeration in html
    recipe_ingredients_query = (
                        db.session.query(Ingredient.name, RecipeToIngredient.ingredient_quantity, RecipeToIngredient.ingredient_measurement)
                        .join(Ingredient, RecipeToIngredient.ingredient_id == Ingredient.id)
                        .where(RecipeToIngredient.recipe_id == recipe.id)
                        )
                    
    recipe_ingredients = recipe_ingredients_query.all()
       
    
    return recipe_ingredients, 200


@recipe_views.route("/updaterecipe", methods=['POST'])
def update():

    request_data = request.data
    json_loads_data = json.loads(request_data)

    old_recipe_id = json_loads_data['recipeId']
    new_ingredients = json_loads_data['ingredientsCopy']

    old_recipe = Recipe.query.get_or_404(old_recipe_id)

    updated_recipe = Recipe(name=old_recipe.name, user_id=old_recipe.user_id)
            
    # deletes our old recipe and all of our ingredients that are linked to the old recipe
    db.session.delete(old_recipe)
    delete_old_ingredients_stmt = delete(RecipeToIngredient).where(RecipeToIngredient.recipe_id==old_recipe.id)
    db.session.execute(delete_old_ingredients_stmt)

    # now we add and commit the new one
    db.session.add(updated_recipe)
    db.session.commit()

    for ingredient in new_ingredients:
        ingredient_name = ingredient[0]
        ingredient_quantity = ingredient[1]
        ingredient_measurement = ingredient[2]
    
        # produces a name or a none value in this variable
        ingredient = Ingredient.query.filter_by(name=ingredient_name).first()

        # if the ingredient is not in the ingredient table...
        if not ingredient:

            # create an instance of ingredient and commit 
            ingredient = Ingredient(name=ingredient_name)

            db.session.add(ingredient)
            db.session.commit()

        # this then needs to be done regardless of whether or not the ingredient has been added to our database before
        recipe_to_ingredient = RecipeToIngredient(recipe_id=updated_recipe.id,
                                                ingredient_id=ingredient.id, 
                                                ingredient_quantity=ingredient_quantity, 
                                                ingredient_measurement=ingredient_measurement)

        db.session.add(recipe_to_ingredient)
        db.session.commit()

    return jsonify(message="recipe updated"), 200
    


@recipe_views.route("/deleterecipe", methods=['POST'])
def delete_recipe():

    # gets the parses the json string data and converts it to a python dictionary
    request_data = request.data
    json_loads_data = json.loads(request_data)

    # gets the recipe id for deletion out of the request
    recipe_id = json_loads_data['recipeIdDeleting']

    # heres the recipe
    recipe_for_deletion = Recipe.query.get_or_404(recipe_id)

    # statement that ques deletion of the record of the recipe in the recipes table 
    delete_recipe_stmt = delete(Recipe).where(Recipe.id == recipe_for_deletion.id)
    # statement that ques the deletion of all of the records 
    delete_recipe_ingredients_stmt = delete(RecipeToIngredient).where(RecipeToIngredient.recipe_id == recipe_for_deletion.id)
    
    # executes and commits these statements
    db.session.execute(delete_recipe_stmt)
    db.session.execute(delete_recipe_ingredients_stmt)
    db.session.commit()

    return jsonify(message='recipe successfully deleted'), 200